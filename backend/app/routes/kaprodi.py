"""
Kaprodi routes blueprint
"""
from flask import Blueprint, request, g
from ..auth import token_required, role_required
from ..models import Mahasiswa, User, PembimbingRequest, Notification, Submission
from ..utils import Sanitizer, Validator, ResponseFormatter
from ..auth.service import AuthService

kaprodi_bp = Blueprint("kaprodi", __name__, url_prefix="/api/kaprodi")


@kaprodi_bp.get("/dosen-list")
@token_required
@role_required("kaprodi")
def list_dosen():
    """List semua dosen with active student counts"""
    dosen_list = User.get_all(role="dosen")

    # Enrich with active bimbingan count
    for d in dosen_list:
        bimbingan = Mahasiswa.get_by_pembimbing(d["_id"])
        d["active_students_count"] = len(bimbingan)

    return ResponseFormatter.success(data=dosen_list, message=f"Total dosen: {len(dosen_list)}")


@kaprodi_bp.get("/dashboard-stats")
@token_required
@role_required("kaprodi")
def dashboard_stats():
    """Get dashboard stats untuk kaprodi"""
    prodi = g.current_user.get("prodi", "")
    mahasiswa_list = Mahasiswa.get_by_prodi(prodi) if prodi else []
    mahasiswa_ids = [m.get("_id") for m in mahasiswa_list]

    pending_initial = [
        req for req in PembimbingRequest.list_by_mahasiswa_ids(mahasiswa_ids, request_type="initial")
        if req.get("status_kaprodi") == "pending"
    ]
    pending_change = [
        req for req in PembimbingRequest.list_by_mahasiswa_ids(mahasiswa_ids, request_type="change")
        if req.get("status_kaprodi") == "pending"
    ]
    dosen_list = User.get_all(role="dosen")

    ttu_selesai = sum(1 for m in mahasiswa_list
                      if (m.get("ttu_status") or {}).get("ttu_3", {}).get("status") == "approved")

    return ResponseFormatter.success(data={
        "total_mahasiswa": len(mahasiswa_list),
        "total_request": len(pending_initial) + len(pending_change),
        "total_dosen": len(dosen_list),
        "ttu_selesai": ttu_selesai,
    })


@kaprodi_bp.get("/mahasiswa")
@token_required
@role_required("kaprodi")
def list_mahasiswa():
    """List mahasiswa di prodi kaprodi with enriched data"""
    prodi = g.current_user.get("prodi", "")
    if not prodi:
        return ResponseFormatter.error("Kaprodi tidak punya prodi assignment", 400)
    
    mahasiswa_list = Mahasiswa.get_by_prodi(prodi)

    # Enrich with dosen names
    dosen_cache = {}
    def get_dosen_name(dosen_id):
        if not dosen_id:
            return None
        if dosen_id not in dosen_cache:
            d = User.find_by_id(dosen_id)
            dosen_cache[dosen_id] = d.get("nama") if d else None
        return dosen_cache[dosen_id]

    for m in mahasiswa_list:
        m.pop("password_hash", None)
        m["pembimbing_1"] = get_dosen_name(m.get("pembimbing_1_id"))
        m["pembimbing_2"] = get_dosen_name(m.get("pembimbing_2_id"))
        m["reviewer"] = get_dosen_name(m.get("reviewer_id"))
    
    return ResponseFormatter.success(
        data=mahasiswa_list,
        message=f"Total mahasiswa: {len(mahasiswa_list)}"
    )


@kaprodi_bp.post("/assign-pembimbing")
@token_required
@role_required("kaprodi")
def assign_pembimbing():
    """Assign dosen pembimbing & reviewer"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
    mahasiswa_id = data.get("mahasiswa_id", "").strip()
    pembimbing_id = data.get("pembimbing_id", "").strip()
    pembimbing_2_id = data.get("pembimbing_2_id", "").strip() or None
    reviewer_id = data.get("reviewer_id", "").strip()
    
    if not all([mahasiswa_id, pembimbing_id, reviewer_id]):
        return ResponseFormatter.error("Mahasiswa, pembimbing, dan reviewer wajib", 400)
    
    # Verify dosen exist
    if not User.find_by_id(pembimbing_id) or not User.find_by_id(reviewer_id):
        return ResponseFormatter.error("Dosen tidak ditemukan", 404)
    if pembimbing_2_id and not User.find_by_id(pembimbing_2_id):
        return ResponseFormatter.error("Pembimbing 2 tidak ditemukan", 404)

    if reviewer_id in [pembimbing_id, pembimbing_2_id]:
        return ResponseFormatter.error("Reviewer tidak boleh sama dengan pembimbing", 400)
    
    if Mahasiswa.set_pembimbing_reviewer(mahasiswa_id, pembimbing_id, reviewer_id, pembimbing_2_id):
        return ResponseFormatter.success(message="Pembimbing & reviewer berhasil diassign")
    
    return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)


@kaprodi_bp.post("/assign-reviewer")
@token_required
@role_required("kaprodi")
def assign_reviewer():
    """Assign only reviewer to mahasiswa"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
    mahasiswa_id = data.get("mahasiswa_id", "").strip()
    reviewer_id = data.get("reviewer_id", "").strip()
    
    if not mahasiswa_id or not reviewer_id:
        return ResponseFormatter.error("Mahasiswa dan reviewer wajib", 400)
    
    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    if not mahasiswa:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)
    
    if not User.find_by_id(reviewer_id):
        return ResponseFormatter.error("Dosen tidak ditemukan", 404)
    
    if reviewer_id in [mahasiswa.get("pembimbing_1_id"), mahasiswa.get("pembimbing_2_id")]:
        return ResponseFormatter.error("Reviewer tidak boleh sama dengan pembimbing", 400)
    
    from ..db import get_db
    from bson import ObjectId
    from datetime import datetime
    db = get_db()
    result = db["mahasiswa"].update_one(
        {"_id": ObjectId(mahasiswa_id)},
        {"$set": {"reviewer_id": reviewer_id, "updated_at": datetime.utcnow()}}
    )
    if result.modified_count > 0:
        return ResponseFormatter.success(message="Reviewer berhasil diassign")
    return ResponseFormatter.error("Gagal assign reviewer", 400)


@kaprodi_bp.get("/pembimbing-requests")
@token_required
@role_required("kaprodi")
def list_pembimbing_requests():
    """List request pembimbing untuk kaprodi"""
    request_type = request.args.get("type")
    prodi = g.current_user.get("prodi", "")
    if not prodi:
        return ResponseFormatter.error("Kaprodi tidak punya prodi assignment", 400)

    mahasiswa_list = Mahasiswa.get_by_prodi(prodi)
    mahasiswa_ids = [m.get("_id") for m in mahasiswa_list]
    requests = [
        req for req in PembimbingRequest.list_by_mahasiswa_ids(mahasiswa_ids, request_type=request_type)
        if req.get("status_kaprodi") == "pending"
    ]

    mahasiswa_map = {m.get("_id"): m for m in mahasiswa_list}
    for req in requests:
        m = mahasiswa_map.get(req.get("mahasiswa_id")) or {}
        req["mahasiswa"] = {
            "nama": m.get("nama"),
            "nim": m.get("nim"),
            "prodi": m.get("prodi"),
        }

    return ResponseFormatter.success(
        data=requests,
        message=f"Total request: {len(requests)}"
    )


def _update_request_for_kaprodi(request_id: str, decision: str):
    req = PembimbingRequest.find_by_id(request_id)
    if not req:
        return ResponseFormatter.error("Request tidak ditemukan", 404)

    if req.get("overall_status") != "pending":
        return ResponseFormatter.error("Request sudah diproses", 400)

    # Kaprodi hanya memproses status kaprodi;
    # request final approved jika status dosen terkait juga approved.
    status_update = {"status_kaprodi": decision}

    updated = PembimbingRequest.update_status(request_id, status_update)
    if not updated:
        return ResponseFormatter.error("Gagal memperbarui request", 400)

    updated_req = PembimbingRequest.find_by_id(request_id)
    overall = PembimbingRequest.compute_overall_status(updated_req)
    if overall != updated_req.get("overall_status"):
        PembimbingRequest.update_status(request_id, {"overall_status": overall})
        updated_req = PembimbingRequest.find_by_id(request_id)

    if overall == "approved":
        mahasiswa = Mahasiswa.find_by_id(updated_req.get("mahasiswa_id"))
        if updated_req.get("request_type") == "initial":
            Mahasiswa.set_pembimbing(
                mahasiswa_id=updated_req.get("mahasiswa_id"),
                pembimbing_1_id=updated_req.get("requested_pembimbing_1_id"),
                pembimbing_2_id=updated_req.get("requested_pembimbing_2_id"),
                judul=updated_req.get("judul"),
            )
        elif updated_req.get("request_type") == "change":
            slot = updated_req.get("requested_slot") or "pembimbing_1"
            Mahasiswa.update_pembimbing_slot(
                mahasiswa_id=updated_req.get("mahasiswa_id"),
                slot=slot,
                dosen_id=updated_req.get("requested_pembimbing_1_id"),
            )

        if mahasiswa:
            Notification.create(
                recipient_email=mahasiswa.get("email"),
                recipient_name=mahasiswa.get("nama"),
                subject="Permintaan pembimbing disetujui",
                body="Permintaan pembimbing Anda telah disetujui dan pembimbing diperbarui.",
                event_type="pembimbing_approved",
            )
    elif overall == "rejected":
        mahasiswa = Mahasiswa.find_by_id(updated_req.get("mahasiswa_id"))
        if mahasiswa:
            Notification.create(
                recipient_email=mahasiswa.get("email"),
                recipient_name=mahasiswa.get("nama"),
                subject="Permintaan pembimbing ditolak",
                body="Permintaan pembimbing Anda ditolak. Silakan ajukan kembali.",
                event_type="pembimbing_rejected",
            )

    return ResponseFormatter.success(message="Request diperbarui")


@kaprodi_bp.post("/pembimbing-requests/<request_id>/approve")
@token_required
@role_required("kaprodi")
def approve_pembimbing_request(request_id):
    """Approve request pembimbing"""
    return _update_request_for_kaprodi(request_id, "approved")


@kaprodi_bp.post("/pembimbing-requests/<request_id>/reject")
@token_required
@role_required("kaprodi")
def reject_pembimbing_request(request_id):
    """Reject request pembimbing"""
    return _update_request_for_kaprodi(request_id, "rejected")


# ─── Dosen Management ───────────────────────────────────────────────

@kaprodi_bp.post("/register-dosen")
@token_required
@role_required("kaprodi")
def register_dosen():
    """Register dosen baru oleh kaprodi"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)

    nama = data.get("nama", "").strip()
    email = data.get("email", "").strip()
    nidn = data.get("nidn", "").strip()
    password = data.get("password", "").strip() or "dosen12345"

    if not nama or not email or not nidn:
        return ResponseFormatter.error("Nama, email, dan NIP/NIDN wajib diisi", 400)

    if not Validator.validate_email(email):
        return ResponseFormatter.error("Email tidak valid", 400)

    if User.find_by_email(email):
        return ResponseFormatter.error("Email sudah terdaftar", 400)

    password_hash = AuthService.hash_password(password)
    user = User.create(
        email=email,
        password_hash=password_hash,
        nama=nama,
        role="dosen",
        nidn=nidn,
    )

    return ResponseFormatter.success(
        data={"user_id": user["_id"], "email": user["email"]},
        message="Dosen berhasil ditambahkan",
        status_code=201
    )


@kaprodi_bp.delete("/dosen/<dosen_id>")
@token_required
@role_required("kaprodi")
def delete_dosen(dosen_id):
    """Hapus dosen (soft delete)"""
    dosen = User.find_by_id(dosen_id)
    if not dosen:
        return ResponseFormatter.error("Dosen tidak ditemukan", 404)
    if dosen.get("role") != "dosen":
        return ResponseFormatter.error("User bukan dosen", 400)

    if User.delete(dosen_id):
        return ResponseFormatter.success(message="Dosen berhasil dihapus")
    return ResponseFormatter.error("Gagal menghapus dosen", 400)


# ─── Deadline Management ────────────────────────────────────────────

@kaprodi_bp.get("/deadlines")
@token_required
@role_required("kaprodi")
def get_deadlines():
    """Get deadline configuration"""
    from ..db import get_db
    db = get_db()
    prodi = g.current_user.get("prodi", "")
    config = db["deadline_config"].find_one({"prodi": prodi})
    if config:
        config["_id"] = str(config["_id"])
    return ResponseFormatter.success(data=config, message="Deadline config")


@kaprodi_bp.put("/deadlines")
@token_required
@role_required("kaprodi")
def save_deadlines():
    """Save deadline configuration"""
    from ..db import get_db
    from datetime import datetime
    db = get_db()
    data = request.get_json(force=True) or {}
    prodi = g.current_user.get("prodi", "")

    deadlines = {
        "ttu1": {"date": data.get("ttu1", {}).get("date", "")},
        "ttu2": {"date": data.get("ttu2", {}).get("date", "")},
        "ttu3": {"date": data.get("ttu3", {}).get("date", "")},
    }

    db["deadline_config"].update_one(
        {"prodi": prodi},
        {"$set": {"deadlines": deadlines, "updated_at": datetime.utcnow(), "prodi": prodi}},
        upsert=True,
    )
    return ResponseFormatter.success(message="Deadline berhasil disimpan")
