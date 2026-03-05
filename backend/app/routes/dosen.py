"""
Dosen routes blueprint
"""
from flask import Blueprint, request, g, Response
from ..auth import token_required, role_required
from ..models import Submission, PembimbingRequest, Mahasiswa, Notification, User, ReviewComment
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
            "judul": m.get("judul"),
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
            "judul": m.get("judul"),
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


@dosen_bp.post("/ttu/<ttu_number>/reject")
@token_required
@role_required("dosen")
def reject_ttu(ttu_number):
    """Tolak TTU dan allow mahasiswa untuk reupload"""
    if ttu_number not in ["ttu_1", "ttu_2", "ttu_3"]:
        return ResponseFormatter.error("TTU harus: ttu_1, ttu_2, atau ttu_3", 400)

    data = request.get_json(force=True) or {}
    mahasiswa_id = data.get("mahasiswa_id", "").strip()
    reason = data.get("reason", "").strip()
    
    if not mahasiswa_id:
        return ResponseFormatter.error("Mahasiswa wajib dipilih", 400)
    
    if not reason or len(reason) < 10:
        return ResponseFormatter.error("Alasan penolakan minimal 10 karakter", 400)

    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    if not mahasiswa:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)

    dosen_id = g.current_user.get("user_id")
    dosen_nama = g.current_user.get("nama")

    # Check authorization
    if ttu_number in ["ttu_1", "ttu_2"]:
        if dosen_id not in [mahasiswa.get("pembimbing_1_id"), mahasiswa.get("pembimbing_2_id")]:
            return ResponseFormatter.error("Anda bukan pembimbing mahasiswa ini", 403)
    else:
        if dosen_id != mahasiswa.get("reviewer_id"):
            return ResponseFormatter.error("Anda bukan reviewer mahasiswa ini", 403)

    # Get latest submission for this TTU
    submission = Submission.get_by_mahasiswa_ttu(mahasiswa_id, ttu_number)
    if not submission:
        return ResponseFormatter.error("Submission tidak ditemukan", 404)

    # Mark submission as rejected
    if Submission.mark_rejected(submission["_id"], reason, dosen_id, dosen_nama):
        Notification.create(
            recipient_email=mahasiswa.get("email"),
            recipient_name=mahasiswa.get("nama"),
            subject=f"TTU {ttu_number.replace('ttu_', '')} ditolak",
            body=f"TTU {ttu_number.replace('ttu_', '')} Anda ditolak. Alasan: {reason}\\n\\nSilakan upload file revisi.",
            event_type="ttu_rejected",
        )
        return ResponseFormatter.success(message="TTU ditolak, mahasiswa dapat upload revisi")

    return ResponseFormatter.error("Gagal menolak TTU", 400)


@dosen_bp.get("/mahasiswa/<mahasiswa_id>/submissions")
@token_required
@role_required("dosen")
def get_mahasiswa_submissions(mahasiswa_id):
    """Get all submissions dari mahasiswa tertentu"""
    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    if not mahasiswa:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)
    
    dosen_id = g.current_user.get("user_id")
    
    # Check if dosen is pembimbing or reviewer
    is_pembimbing = dosen_id in [mahasiswa.get("pembimbing_1_id"), mahasiswa.get("pembimbing_2_id")]
    is_reviewer = dosen_id == mahasiswa.get("reviewer_id")
    
    if not (is_pembimbing or is_reviewer):
        return ResponseFormatter.error("Anda tidak memiliki akses ke data mahasiswa ini", 403)
    
    submissions = Submission.get_by_mahasiswa(mahasiswa_id)
    return ResponseFormatter.success(data=submissions, message=f"Total: {len(submissions)}")


@dosen_bp.get("/mahasiswa/<mahasiswa_id>/ttu/<ttu_number>/history")
@token_required
@role_required("dosen")
def get_ttu_submission_history(mahasiswa_id, ttu_number):
    """Get submission history untuk specific TTU"""
    if ttu_number not in ["ttu_1", "ttu_2", "ttu_3"]:
        return ResponseFormatter.error("TTU harus: ttu_1, ttu_2, atau ttu_3", 400)
    
    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    if not mahasiswa:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)
    
    dosen_id = g.current_user.get("user_id")
    
    # Check authorization
    if ttu_number in ["ttu_1", "ttu_2"]:
        is_authorized = dosen_id in [mahasiswa.get("pembimbing_1_id"), mahasiswa.get("pembimbing_2_id")]
    else:
        is_authorized = dosen_id == mahasiswa.get("reviewer_id")
    
    if not is_authorized:
        return ResponseFormatter.error("Anda tidak memiliki akses ke data ini", 403)
    
    history = Submission.get_all_by_mahasiswa_ttu(mahasiswa_id, ttu_number)
    return ResponseFormatter.success(data=history, message=f"Total revisi: {len(history)}")


@dosen_bp.get("/submissions/<submission_id>/download")
@token_required
@role_required("dosen")
def download_file(submission_id):
    """Download file submission dari database"""
    submission = Submission.get_by_id(submission_id)
    if not submission:
        return ResponseFormatter.error("Submission tidak ditemukan", 404)
    
    # Check if dosen is pembimbing or reviewer
    mahasiswa = Mahasiswa.find_by_id(submission.get("mahasiswa_id"))
    if not mahasiswa:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)
    
    dosen_id = g.current_user.get("user_id")
    is_pembimbing = dosen_id in [mahasiswa.get("pembimbing_1_id"), mahasiswa.get("pembimbing_2_id")]
    is_reviewer = dosen_id == mahasiswa.get("reviewer_id")
    
    if not (is_pembimbing or is_reviewer):
        return ResponseFormatter.error("Anda tidak memiliki akses ke file ini", 403)
    
    file_info = Submission.get_file_data(submission_id)
    if not file_info:
        return ResponseFormatter.error("File tidak ditemukan", 404)
    
    resp = Response(
        file_info["file_data"],
        mimetype=file_info["file_content_type"],
        headers={
            "Content-Disposition": f'inline; filename="{file_info["file_name"]}"',
            "Content-Length": str(len(file_info["file_data"])),
        }
    )
    # Allow CORS for file downloads
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp


@dosen_bp.get("/mahasiswa/<mahasiswa_id>/review-comments")
@token_required
@role_required("dosen")
def get_review_comments(mahasiswa_id):
    """Get review comments for a mahasiswa's TTU3 review"""
    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    if not mahasiswa:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)

    dosen_id = g.current_user.get("user_id")
    is_pembimbing = dosen_id in [mahasiswa.get("pembimbing_1_id"), mahasiswa.get("pembimbing_2_id")]
    is_reviewer = dosen_id == mahasiswa.get("reviewer_id")

    if not (is_pembimbing or is_reviewer):
        return ResponseFormatter.error("Anda tidak memiliki akses", 403)

    comments = ReviewComment.get_by_mahasiswa(mahasiswa_id)
    return ResponseFormatter.success(data=comments, message=f"Total: {len(comments)}")


@dosen_bp.post("/mahasiswa/<mahasiswa_id>/review-comments")
@token_required
@role_required("dosen")
def post_review_comment(mahasiswa_id):
    """Post a review comment as dosen (pembimbing or reviewer)"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)

    message = (data.get("message") or "").strip()
    if not message:
        return ResponseFormatter.error("Pesan tidak boleh kosong", 400)

    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    if not mahasiswa:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)

    dosen_id = g.current_user.get("user_id")
    dosen_nama = g.current_user.get("nama", "Dosen")
    is_pembimbing = dosen_id in [mahasiswa.get("pembimbing_1_id"), mahasiswa.get("pembimbing_2_id")]
    is_reviewer = dosen_id == mahasiswa.get("reviewer_id")

    if not (is_pembimbing or is_reviewer):
        return ResponseFormatter.error("Anda tidak memiliki akses", 403)

    sender_role = "reviewer" if is_reviewer else "pembimbing"

    comment = ReviewComment.create(
        mahasiswa_id=mahasiswa_id,
        sender_id=dosen_id,
        sender_name=dosen_nama,
        sender_role=sender_role,
        message=message,
    )

    return ResponseFormatter.success(data=comment, message="Komentar dikirim", status_code=201)
