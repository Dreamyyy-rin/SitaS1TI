"""
Kaprodi routes blueprint
"""
from flask import Blueprint, request, g
from ..auth import token_required, role_required
from ..models import Mahasiswa, User
from ..utils import Sanitizer, ResponseFormatter

kaprodi_bp = Blueprint("kaprodi", __name__, url_prefix="/kaprodi")


@kaprodi_bp.get("/mahasiswa")
@token_required
@role_required("kaprodi")
def list_mahasiswa():
    """List mahasiswa di prodi kaprodi"""
    prodi = g.current_user.get("prodi", "")
    if not prodi:
        return ResponseFormatter.error("Kaprodi tidak punya prodi assignment", 400)
    
    mahasiswa_list = Mahasiswa.get_by_prodi(prodi)
    
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
    reviewer_id = data.get("reviewer_id", "").strip()
    
    if not all([mahasiswa_id, pembimbing_id, reviewer_id]):
        return ResponseFormatter.error("Semua field wajib", 400)
    
    # Verify dosen exist
    if not User.find_by_id(pembimbing_id) or not User.find_by_id(reviewer_id):
        return ResponseFormatter.error("Dosen tidak ditemukan", 404)
    
    if Mahasiswa.set_pembimbing_reviewer(mahasiswa_id, pembimbing_id, reviewer_id):
        return ResponseFormatter.success(message="Pembimbing & reviewer berhasil diassign")
    
    return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)
