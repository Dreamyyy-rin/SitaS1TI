"""
Dosen routes blueprint
"""
from flask import Blueprint, request, g
from ..auth import token_required, role_required
from ..models import Submission, PembimbingRequest, Mahasiswa, Notification, User
from ..utils import Sanitizer, ResponseFormatter

dosen_bp = Blueprint("dosen", __name__, url_prefix="/api/dosen")


@dosen_bp.get("/dashboard-stats")
@token_required
@role_required("dosen")
def dashboard_stats():
    """Dashboard statistics for dosen"""
    dosen_id = g.current_user.get("user_id")
    mahasiswa_bimbingan = Mahasiswa.get_by_pembimbing(dosen_id)
    pending_requests = PembimbingRequest.list_by_dosen(dosen_id)

    ttu_selesai = sum(1 for m in mahasiswa_bimbingan
                      if (m.get("ttu_status") or {}).get("ttu_3", {}).get("status") == "approved")

    return ResponseFormatter.success(data={
        "total_mahasiswa": len(mahasiswa_bimbingan),
        "total_request": len(pending_requests),
        "ttu_selesai": ttu_selesai,
    })


@dosen_bp.get("/mahasiswa-bimbingan")
@token_required
@role_required("dosen")
def list_mahasiswa_bimbingan():
    """List mahasiswa yang dibimbing dosen ini"""
    dosen_id = g.current_user.get("user_id")
    mahasiswa_list = Mahasiswa.get_by_pembimbing(dosen_id)

    result = []
    for m in mahasiswa_list:
        reviewer = User.find_by_id(m.get("reviewer_id")) if m.get("reviewer_id") else None
        ttu = m.get("ttu_status") or {}
        result.append({
            "_id": m["_id"],
            "nama": m.get("nama"),
            "nim": m.get("nim"),
            "prodi": m.get("prodi"),
            "email": m.get("email"),
            "reviewer": reviewer.get("nama") if reviewer else None,
            "ttu_status": ttu,
            "onboarding_status": m.get("onboarding_status"),
        })

    return ResponseFormatter.success(data=result, message=f"Total: {len(result)}")


@dosen_bp.get("/mahasiswa-review")
@token_required
@role_required("dosen")
def list_mahasiswa_review():
    """List mahasiswa yang di-review oleh dosen ini"""
    dosen_id = g.current_user.get("user_id")
    mahasiswa_list = Mahasiswa.get_by_reviewer(dosen_id)

    result = []
    for m in mahasiswa_list:
        pembimbing_1 = User.find_by_id(m.get("pembimbing_1_id")) if m.get("pembimbing_1_id") else None
        ttu = m.get("ttu_status") or {}
        submissions = Submission.get_by_mahasiswa(m["_id"])
        result.append({
            "_id": m["_id"],
            "nama": m.get("nama"),
            "nim": m.get("nim"),
            "prodi": m.get("prodi"),
            "email": m.get("email"),
            "pembimbing_1": pembimbing_1.get("nama") if pembimbing_1 else None,
            "ttu_status": ttu,
            "submissions": submissions,
        })

    return ResponseFormatter.success(data=result, message=f"Total: {len(result)}")


@dosen_bp.post("/submissions/<submission_id>/comment")
@token_required
@role_required("dosen")
def add_comment(submission_id):
    """Add comment ke submission"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
    comment_text = data.get("comment", "").strip()
    if not comment_text:
        return ResponseFormatter.error("Komentar tidak boleh kosong", 400)
    
    dosen_id = g.current_user.get("user_id")
    dosen_nama = g.current_user.get("nama")
    
    if Submission.add_comment(submission_id, dosen_id, dosen_nama, comment_text):
        return ResponseFormatter.success(message="Komentar ditambahkan")
    
    return ResponseFormatter.error("Submission tidak ditemukan", 404)


@dosen_bp.post("/submissions/<submission_id>/review")
@token_required
@role_required("dosen")
def review(submission_id):
    """Review submission dengan score"""
    data = request.get_json(force=True) or {}
    
    score = data.get("score")
    if score is None or not (0 <= score <= 100):
        return ResponseFormatter.error("Score harus 0-100", 400)
    
    if Submission.mark_reviewed(submission_id, score):
        return ResponseFormatter.success(message="Review selesai")
    
    return ResponseFormatter.error("Submission tidak ditemukan", 404)


@dosen_bp.get("/pembimbing-requests")
@token_required
@role_required("dosen")
def list_pembimbing_requests():
    """List request pembimbing untuk dosen"""
    request_type = request.args.get("type")
    dosen_id = g.current_user.get("user_id")
    requests = PembimbingRequest.list_by_dosen(dosen_id, request_type=request_type)

    # enrich mahasiswa info
    mahasiswa_map = {}
    for req in requests:
        m_id = req.get("mahasiswa_id")
        if m_id and m_id not in mahasiswa_map:
            mahasiswa_map[m_id] = Mahasiswa.find_by_id(m_id)

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


def _update_request_for_dosen(request_id: str, decision: str):
    dosen_id = g.current_user.get("user_id")
    req = PembimbingRequest.find_by_id(request_id)
    if not req:
        return ResponseFormatter.error("Request tidak ditemukan", 404)

    if req.get("overall_status") != "pending":
        return ResponseFormatter.error("Request sudah diproses", 400)

    status_updates = {}
    if req.get("requested_pembimbing_1_id") == dosen_id:
        status_updates["status_dosen_1"] = decision
    elif req.get("requested_pembimbing_2_id") == dosen_id:
        status_updates["status_dosen_2"] = decision
    else:
        return ResponseFormatter.error("Anda tidak terkait dengan request ini", 403)

    updated = PembimbingRequest.update_status(request_id, status_updates)
    if not updated:
        return ResponseFormatter.error("Gagal memperbarui request", 400)

    # refresh and compute overall
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


@dosen_bp.post("/pembimbing-requests/<request_id>/approve")
@token_required
@role_required("dosen")
def approve_pembimbing_request(request_id):
    """Approve request pembimbing"""
    return _update_request_for_dosen(request_id, "approved")


@dosen_bp.post("/pembimbing-requests/<request_id>/reject")
@token_required
@role_required("dosen")
def reject_pembimbing_request(request_id):
    """Reject request pembimbing"""
    return _update_request_for_dosen(request_id, "rejected")


@dosen_bp.post("/ttu/<ttu_number>/approve")
@token_required
@role_required("dosen")
def approve_ttu(ttu_number):
    """ACC TTU agar mahasiswa bisa lanjut ke tahap berikutnya"""
    if ttu_number not in ["ttu_1", "ttu_2", "ttu_3"]:
        return ResponseFormatter.error("TTU harus: ttu_1, ttu_2, atau ttu_3", 400)

    data = request.get_json(force=True) or {}
    mahasiswa_id = data.get("mahasiswa_id", "").strip()
    if not mahasiswa_id:
        return ResponseFormatter.error("Mahasiswa wajib dipilih", 400)

    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    if not mahasiswa:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)

    dosen_id = g.current_user.get("user_id")

    if ttu_number in ["ttu_1", "ttu_2"]:
        if dosen_id not in [mahasiswa.get("pembimbing_1_id"), mahasiswa.get("pembimbing_2_id")]:
            return ResponseFormatter.error("Anda bukan pembimbing mahasiswa ini", 403)
    else:
        if dosen_id != mahasiswa.get("reviewer_id"):
            return ResponseFormatter.error("Anda bukan reviewer mahasiswa ini", 403)

    if Mahasiswa.approve_ttu(mahasiswa_id, ttu_number):
        Notification.create(
            recipient_email=mahasiswa.get("email"),
            recipient_name=mahasiswa.get("nama"),
            subject=f"TTU {ttu_number.replace('ttu_', '')} disetujui",
            body=f"TTU {ttu_number.replace('ttu_', '')} Anda telah disetujui. Silakan lanjut ke tahap berikutnya.",
            event_type="ttu_approved",
        )
        return ResponseFormatter.success(message="TTU disetujui")

    return ResponseFormatter.error("Gagal mengubah status TTU", 400)
