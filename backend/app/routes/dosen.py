"""
Dosen routes blueprint
"""
from flask import Blueprint, request, g
from ..auth import token_required, role_required
from ..models import Submission
from ..utils import Sanitizer, ResponseFormatter

dosen_bp = Blueprint("dosen", __name__, url_prefix="/dosen")


@dosen_bp.get("/submissions")
@token_required
@role_required("dosen")
def list_submissions():
    """List submissions untuk di-review"""
    dosen_id = g.current_user.get("user_id")
    
    from ..db import get_db
    db = get_db("sita_mahasiswa")
    
    # Bisa improve: query untuk submissions yang assigned ke dosen ini
    submissions = list(db.submissions.find({}))
    for s in submissions:
        s["_id"] = str(s["_id"])
    
    return ResponseFormatter.success(
        data=submissions,
        message=f"Total submissions: {len(submissions)}"
    )


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
