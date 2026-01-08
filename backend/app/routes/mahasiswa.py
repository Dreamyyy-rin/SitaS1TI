"""
Mahasiswa routes blueprint
"""
from flask import Blueprint, request, g
from werkzeug.utils import secure_filename
import os
from ..auth import AuthService, token_required, role_required
from ..models import Mahasiswa, Submission, Notification
from ..utils import Sanitizer, Validator, ResponseFormatter

mahasiswa_bp = Blueprint("mahasiswa", __name__, url_prefix="/mahasiswa")

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "docx", "doc", "txt", "pptx"}
MAX_FILE_SIZE_MB = 50

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@mahasiswa_bp.post("/register")
def register():
    """Register mahasiswa baru"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
    required = ["nim", "nama", "email", "password", "prodi"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return ResponseFormatter.error(f"Field wajib: {', '.join(missing)}", 400)
    
    nim = data.get("nim", "").strip()
    nama = data.get("nama", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    prodi = data.get("prodi", "").strip()
    angkatan = data.get("angkatan", 2024)
    
    if not Validator.validate_nim(nim):
        return ResponseFormatter.error("NIM tidak valid", 400)
    
    if not Validator.validate_email(email):
        return ResponseFormatter.error("Email tidak valid", 400)
    
    if Mahasiswa.find_by_nim(nim) or Mahasiswa.find_by_email(email):
        return ResponseFormatter.error("NIM atau email sudah terdaftar", 400)
    
    password_hash = AuthService.hash_password(password)
    mahasiswa = Mahasiswa.create(
        nim=nim,
        nama=nama,
        email=email,
        password_hash=password_hash,
        prodi=prodi,
        angkatan=angkatan
    )
    
    return ResponseFormatter.success(
        data={"mahasiswa_id": mahasiswa["_id"], "nim": mahasiswa["nim"]},
        message="Registrasi berhasil",
        status_code=201
    )


@mahasiswa_bp.get("/profile")
@token_required
@role_required("mahasiswa")
def profile():
    """Get profile mahasiswa"""
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    
    if not mahasiswa:
        return ResponseFormatter.error("Profil tidak ditemukan", 404)
    
    mahasiswa.pop("password_hash", None)
    return ResponseFormatter.success(data=mahasiswa, message="Profile")


@mahasiswa_bp.post("/upload/<ttu_number>")
@token_required
@role_required("mahasiswa")
def upload(ttu_number):
    """Upload submission"""
    if ttu_number not in ["ttu_1", "ttu_2", "ttu_3"]:
        return ResponseFormatter.error("TTU harus: ttu_1, ttu_2, atau ttu_3", 400)
    
    if "file" not in request.files:
        return ResponseFormatter.error("File tidak ada", 400)
    
    file = request.files["file"]
    if file.filename == "":
        return ResponseFormatter.error("File tidak dipilih", 400)
    
    if not Validator.validate_file_extension(file.filename, ALLOWED_EXTENSIONS):
        return ResponseFormatter.error(f"File harus: {', '.join(ALLOWED_EXTENSIONS)}", 400)
    
    file_size = len(file.read())
    file.seek(0)
    
    if not Validator.validate_file_size(file_size, MAX_FILE_SIZE_MB):
        return ResponseFormatter.error(f"File max {MAX_FILE_SIZE_MB}MB", 400)
    
    filename = secure_filename(file.filename)
    filename = Sanitizer.sanitize_filename(filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    
    submission = Submission.create(
        mahasiswa_id=mahasiswa_id,
        ttu_number=ttu_number,
        file_path=file_path,
        file_name=filename,
        file_size=file_size
    )
    
    Notification.create(
        recipient_email=g.current_user.get("email"),
        recipient_name=g.current_user.get("nama"),
        subject=f"Upload {ttu_number} berhasil",
        body=f"File {filename} berhasil diupload",
        event_type="uploaded"
    )
    
    return ResponseFormatter.success(
        data={"submission_id": submission["_id"]},
        message=f"Upload {ttu_number} berhasil",
        status_code=201
    )


@mahasiswa_bp.get("/submissions")
@token_required
@role_required("mahasiswa")
def list_submissions():
    """List submissions mahasiswa"""
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    submissions = Submission.get_by_mahasiswa(mahasiswa_id)
    
    return ResponseFormatter.success(
        data=submissions,
        message=f"Total submissions: {len(submissions)}"
    )


@mahasiswa_bp.get("/submissions/<submission_id>/comments")
@token_required
@role_required("mahasiswa")
def get_comments(submission_id):
    """Get comments pada submission"""
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    submission = Submission.get_by_id(submission_id)
    
    if not submission or submission.get("mahasiswa_id") != mahasiswa_id:
        return ResponseFormatter.error("Submission tidak ditemukan", 404)
    
    return ResponseFormatter.success(
        data={"comments": submission.get("comments", [])},
        message="Comments"
    )
