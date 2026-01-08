"""
Routes untuk SITA Backend
"""

from flask import Blueprint, request, g, send_file
from werkzeug.utils import secure_filename
import os
from .auth import AuthService, token_required, role_required, authenticate_and_authorize
from .models import User, Mahasiswa, Submission, Notification, UserRole, TTUStatus
from .utils import Sanitizer, Validator, ResponseFormatter
from .config import settings

api_bp = Blueprint("api", __name__)

# Config upload
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "docx", "doc", "txt", "pptx"}
MAX_FILE_SIZE_MB = 50

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ============= HEALTH & INFO =============

@api_bp.get("/health")
def health_check():
    return ResponseFormatter.success(data={"status": "ok"}, message="API running")


@api_bp.get("/ping")
def ping():
    return ResponseFormatter.success(data={"message": "pong"})


# ============= AUTH ENDPOINTS =============

@api_bp.post("/auth/login")
def login():
    """Login untuk dosen, kaprodi, superadmin"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
    email = data.get("email", "").strip()
    password = data.get("password", "")
    
    if not email or not password:
        return ResponseFormatter.error("Email dan password harus diisi", 400)
    
    if not Validator.validate_email(email):
        return ResponseFormatter.error("Format email tidak valid", 400)
    
    token, user_data, error = AuthService.login_user(email, password, is_mahasiswa=False)
    
    if error:
        return ResponseFormatter.error(error, 401)
    
    return ResponseFormatter.success(
        data={"token": token, "user": user_data},
        message="Login berhasil"
    )


@api_bp.post("/auth/login-mahasiswa")
def login_mahasiswa():
    """Login khusus mahasiswa"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
    email = data.get("email", "").strip()
    password = data.get("password", "")
    
    if not email or not password:
        return ResponseFormatter.error("Email dan password harus diisi", 400)
    
    token, user_data, error = AuthService.login_user(email, password, is_mahasiswa=True)
    
    if error:
        return ResponseFormatter.error(error, 401)
    
    return ResponseFormatter.success(
        data={"token": token, "user": user_data},
        message="Login mahasiswa berhasil"
    )


# ============= SUPERADMIN ENDPOINTS =============

@api_bp.post("/superadmin/register-user")
@token_required
@role_required("superadmin")
def register_user():
    """Superadmin: Register user baru (dosen, kaprodi)"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
    # Validation
    required_fields = ["email", "password", "nama", "role", "nidn"]
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return ResponseFormatter.error(f"Field wajib: {', '.join(missing)}", 400)
    
    email = data.get("email", "").strip()
    nama = data.get("nama", "").strip()
    role = data.get("role", "").strip()
    nidn = data.get("nidn", "").strip()
    prodi = data.get("prodi", "").strip()
    password = data.get("password", "")
    
    if not Validator.validate_email(email):
        return ResponseFormatter.error("Email tidak valid", 400)
    
    if not Validator.validate_nidn(nidn):
        return ResponseFormatter.error("NIDN harus 10 digit", 400)
    
    if role not in [UserRole.DOSEN, UserRole.KAPRODI]:
        return ResponseFormatter.error("Role harus: dosen atau kaprodi", 400)
    
    if not password or len(password) < 8:
        return ResponseFormatter.error("Password minimal 8 karakter", 400)
    
    # Check email sudah ada
    if User.find_by_email(email):
        return ResponseFormatter.error("Email sudah terdaftar", 400)
    
    # Create user
    password_hash = AuthService.hash_password(password)
    user = User.create(
        email=email,
        password_hash=password_hash,
        nama=nama,
        role=role,
        nidn=nidn,
        prodi=prodi if role == UserRole.KAPRODI else None
    )
    
    return ResponseFormatter.success(
        data={"user_id": user["_id"], "email": user["email"]},
        message="User berhasil dibuat",
        status_code=201
    )


@api_bp.get("/superadmin/users")
@token_required
@role_required("superadmin")
def list_users():
    """Superadmin: List semua users"""
    role_filter = request.args.get("role")  # Optional filter
    users = User.get_all_users(role=role_filter)
    
    for user in users:
        user.pop("password_hash", None)
    
    return ResponseFormatter.success(
        data=users,
        message=f"Total users: {len(users)}"
    )


@api_bp.delete("/superadmin/users/<user_id>")
@token_required
@role_required("superadmin")
def delete_user(user_id):
    """Superadmin: Delete user"""
    if User.delete_user(user_id):
        return ResponseFormatter.success(message="User berhasil dihapus")
    return ResponseFormatter.error("User tidak ditemukan", 404)


# ============= KAPRODI ENDPOINTS =============

@api_bp.get("/kaprodi/mahasiswa")
@token_required
@role_required("kaprodi")
def kaprodi_list_mahasiswa():
    """Kaprodi: List mahasiswa di prodi mereka"""
    prodi = g.current_user.get("prodi", "")
    if not prodi:
        return ResponseFormatter.error("Kaprodi tidak memiliki prodi assignment", 400)
    
    mahasiswa_list = Mahasiswa.get_all_by_prodi(prodi)
    return ResponseFormatter.success(
        data=mahasiswa_list,
        message=f"Total mahasiswa: {len(mahasiswa_list)}"
    )


@api_bp.post("/kaprodi/assign-pembimbing")
@token_required
@role_required("kaprodi")
def assign_pembimbing():
    """Kaprodi: Assign dosen pembimbing ke mahasiswa"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
    mahasiswa_id = data.get("mahasiswa_id", "").strip()
    pembimbing_id = data.get("pembimbing_id", "").strip()
    reviewer_id = data.get("reviewer_id", "").strip()
    
    if not all([mahasiswa_id, pembimbing_id, reviewer_id]):
        return ResponseFormatter.error("mahasiswa_id, pembimbing_id, reviewer_id wajib", 400)
    
    # Verify dosen exist
    if not User.find_by_id(pembimbing_id) or not User.find_by_id(reviewer_id):
        return ResponseFormatter.error("Dosen tidak ditemukan", 404)
    
    if Mahasiswa.set_pembimbing_reviewer(mahasiswa_id, pembimbing_id, reviewer_id):
        return ResponseFormatter.success(message="Pembimbing dan reviewer berhasil diassign")
    
    return ResponseFormatter.error("Gagal mengassign pembimbing", 400)


# ============= DOSEN ENDPOINTS =============

@api_bp.get("/dosen/submissions")
@token_required
@role_required("dosen")
def dosen_list_submissions():
    """Dosen: List submissions yang di-review"""
    dosen_id = g.current_user.get("user_id")
    
    db = __import__('pymongo').MongoClient(settings.mongo_uri)["sita_mahasiswa"]
    submissions = list(db.submissions.find({"reviewer_id": dosen_id}))
    
    for s in submissions:
        s["_id"] = str(s["_id"])
    
    return ResponseFormatter.success(
        data=submissions,
        message=f"Total submissions: {len(submissions)}"
    )


@api_bp.post("/dosen/submissions/<submission_id>/comment")
@token_required
@role_required("dosen")
def add_comment_submission(submission_id):
    """Dosen: Tambah komentar ke submission"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
    comment_text = data.get("comment", "").strip()
    if not comment_text:
        return ResponseFormatter.error("Komentar tidak boleh kosong", 400)
    
    dosen_id = g.current_user.get("user_id")
    dosen_nama = g.current_user.get("nama")
    
    if Submission.add_comment(submission_id, dosen_id, dosen_nama, comment_text):
        return ResponseFormatter.success(message="Komentar berhasil ditambah")
    
    return ResponseFormatter.error("Submission tidak ditemukan", 404)


@api_bp.post("/dosen/submissions/<submission_id>/review")
@token_required
@role_required("dosen")
def review_submission(submission_id):
    """Dosen: Review submission dengan score"""
    data = request.get_json(force=True) or {}
    
    score = data.get("score")
    if score is None or not (0 <= score <= 100):
        return ResponseFormatter.error("Score harus 0-100", 400)
    
    if Submission.mark_reviewed(submission_id, score):
        return ResponseFormatter.success(message="Submission berhasil di-review")
    
    return ResponseFormatter.error("Submission tidak ditemukan", 404)


# ============= MAHASISWA ENDPOINTS =============

@api_bp.post("/mahasiswa/register")
def register_mahasiswa():
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
        message="Registrasi mahasiswa berhasil",
        status_code=201
    )


@api_bp.get("/mahasiswa/profile")
@token_required
@role_required("mahasiswa")
def mahasiswa_profile():
    """Mahasiswa: Get profile & status TTU"""
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    
    if not mahasiswa:
        return ResponseFormatter.error("Profil mahasiswa tidak ditemukan", 404)
    
    mahasiswa.pop("password_hash", None)
    
    return ResponseFormatter.success(
        data=mahasiswa,
        message="Profile mahasiswa"
    )


@api_bp.post("/mahasiswa/upload/<ttu_number>")
@token_required
@role_required("mahasiswa")
def upload_submission(ttu_number):
    """Mahasiswa: Upload submission untuk TTU"""
    if ttu_number not in ["ttu_1", "ttu_2", "ttu_3"]:
        return ResponseFormatter.error("TTU harus: ttu_1, ttu_2, atau ttu_3", 400)
    
    # Check file exist
    if "file" not in request.files:
        return ResponseFormatter.error("File tidak ada", 400)
    
    file = request.files["file"]
    if file.filename == "":
        return ResponseFormatter.error("File tidak dipilih", 400)
    
    # Validate file
    if not Validator.validate_file_extension(file.filename, ALLOWED_EXTENSIONS):
        return ResponseFormatter.error(f"File harus: {', '.join(ALLOWED_EXTENSIONS)}", 400)
    
    file_size = len(file.read())
    file.seek(0)  # Reset pointer
    
    if not Validator.validate_file_size(file_size, MAX_FILE_SIZE_MB):
        return ResponseFormatter.error(f"File max {MAX_FILE_SIZE_MB}MB", 400)
    
    # Save file
    filename = secure_filename(file.filename)
    filename = Sanitizer.sanitize_filename(filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    
    # Create submission
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    
    submission = Submission.create(
        mahasiswa_id=mahasiswa_id,
        ttu_number=ttu_number,
        file_path=file_path,
        file_name=filename,
        file_size=file_size
    )
    
    # Create notification
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


@api_bp.get("/mahasiswa/submissions")
@token_required
@role_required("mahasiswa")
def mahasiswa_list_submissions():
    """Mahasiswa: List submissions mereka"""
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    
    from pymongo import MongoClient
    db = MongoClient(settings.mongo_uri)["sita_mahasiswa"]
    submissions = list(db.submissions.find({"mahasiswa_id": mahasiswa_id}))
    
    for s in submissions:
        s["_id"] = str(s["_id"])
    
    return ResponseFormatter.success(
        data=submissions,
        message=f"Total submissions: {len(submissions)}"
    )


@api_bp.get("/mahasiswa/submissions/<submission_id>/comments")
@token_required
@role_required("mahasiswa")
def mahasiswa_get_comments(submission_id):
    """Mahasiswa: Get comments ke submission mereka"""
    from pymongo import MongoClient
    from bson import ObjectId
    
    db = MongoClient(settings.mongo_uri)["sita_mahasiswa"]
    submission = db.submissions.find_one(
        {
            "_id": ObjectId(submission_id),
            "mahasiswa_id": g.current_user.get("mahasiswa_id")
    
    return ResponseFormatter.success(
        data={"comments": submission.get("comments", [])},
        message="Comments"
    )
