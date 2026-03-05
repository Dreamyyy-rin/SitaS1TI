"""
Mahasiswa routes blueprint
"""
from flask import Blueprint, request, g, Response
from werkzeug.utils import secure_filename
import mimetypes
from ..auth import AuthService, token_required, role_required
from ..models import Mahasiswa, Submission, Notification, User, PembimbingRequest, TTU3Requirement, ReviewComment
from ..utils import Sanitizer, Validator, ResponseFormatter

mahasiswa_bp = Blueprint("mahasiswa", __name__, url_prefix="/api/mahasiswa")

ALLOWED_EXTENSIONS = {"pdf", "docx", "doc", "txt", "pptx"}
ALLOWED_REQUIREMENT_EXTENSIONS = {"pdf", "docx", "doc"}
MAX_FILE_SIZE_MB = 50


@mahasiswa_bp.post("/register")
@token_required
@role_required("superadmin")
def register():
    """Register mahasiswa baru"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
    required = ["nim", "nama", "email", "password", "prodi"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return ResponseFormatter.error(f"Field wajib: {', '.join(missing)}", 400)
    
    nim = (data.get("nim") or "").strip()
    nama = (data.get("nama") or "").strip()
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""
    prodi = (data.get("prodi") or "").strip()
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


@mahasiswa_bp.get("/dosen-list")
@token_required
@role_required("mahasiswa")
def list_dosen():
    """List dosen untuk pilihan pembimbing"""
    dosen_list = User.get_all(role="dosen")
    return ResponseFormatter.success(data=dosen_list, message=f"Total dosen: {len(dosen_list)}")


@mahasiswa_bp.get("/pembimbing")
@token_required
@role_required("mahasiswa")
def get_pembimbing():
    """Get pembimbing 1 & 2 mahasiswa"""
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    if not mahasiswa:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)

    pembimbing_1 = User.find_by_id(mahasiswa.get("pembimbing_1_id")) if mahasiswa.get("pembimbing_1_id") else None
    pembimbing_2 = User.find_by_id(mahasiswa.get("pembimbing_2_id")) if mahasiswa.get("pembimbing_2_id") else None

    if pembimbing_1:
        pembimbing_1.pop("password_hash", None)
    if pembimbing_2:
        pembimbing_2.pop("password_hash", None)

    return ResponseFormatter.success(
        data={
            "pembimbing_1": pembimbing_1,
            "pembimbing_2": pembimbing_2,
        },
        message="Pembimbing"
    )


@mahasiswa_bp.get("/pembimbing-request/status")
@token_required
@role_required("mahasiswa")
def pembimbing_request_status():
    """Cek status request pembimbing"""
    request_type = Sanitizer.sanitize_query_value(request.args.get("type"))
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    pending_request = PembimbingRequest.find_pending_by_mahasiswa(mahasiswa_id, request_type=request_type)
    return ResponseFormatter.success(
        data=pending_request,
        message="Status request"
    )


@mahasiswa_bp.post("/pembimbing-request/initial")
@token_required
@role_required("mahasiswa")
def create_initial_request():
    """Request pembimbing pertama kali"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)

    pembimbing_1_id = (data.get("pembimbing_1_id") or "").strip()
    pembimbing_2_id = (data.get("pembimbing_2_id") or "").strip() or None
    judul = (data.get("judul") or "").strip() or None

    if not pembimbing_1_id:
        return ResponseFormatter.error("Pembimbing 1 wajib dipilih", 400)

    if pembimbing_2_id and pembimbing_2_id == pembimbing_1_id:
        return ResponseFormatter.error("Pembimbing 2 tidak boleh sama dengan Pembimbing 1", 400)

    mahasiswa_id = g.current_user.get("mahasiswa_id")
    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    if not mahasiswa:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)

    if mahasiswa.get("onboarding_status") == "approved":
        return ResponseFormatter.error("Pembimbing sudah ditetapkan", 400)

    if PembimbingRequest.find_pending_by_mahasiswa(mahasiswa_id, request_type="initial"):
        return ResponseFormatter.error("Request pembimbing sedang diproses", 400)

    if not User.find_by_id(pembimbing_1_id):
        return ResponseFormatter.error("Pembimbing 1 tidak ditemukan", 404)
    if pembimbing_2_id and not User.find_by_id(pembimbing_2_id):
        return ResponseFormatter.error("Pembimbing 2 tidak ditemukan", 404)

    request_doc = PembimbingRequest.create_initial(
        mahasiswa_id=mahasiswa_id,
        pembimbing_1_id=pembimbing_1_id,
        pembimbing_2_id=pembimbing_2_id,
        judul=judul,
    )

    return ResponseFormatter.success(
        data=request_doc,
        message="Request pembimbing berhasil dikirim",
        status_code=201
    )


@mahasiswa_bp.post("/pembimbing-request")
@token_required
@role_required("mahasiswa")
def create_change_request():
    """Request pergantian pembimbing"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)

    requested_pembimbing_id = (data.get("newPembimbingId") or "").strip()
    alasan = (data.get("alasan") or "").strip()
    requested_slot = (data.get("slot") or "pembimbing_1").strip()

    if not requested_pembimbing_id or not alasan:
        return ResponseFormatter.error("Dosen dan alasan wajib diisi", 400)

    if requested_pembimbing_id == "kaprodi_choice":
        return ResponseFormatter.error("Silakan pilih dosen pembimbing", 400)

    if requested_slot not in ["pembimbing_1", "pembimbing_2"]:
        return ResponseFormatter.error("Slot pembimbing tidak valid", 400)

    mahasiswa_id = g.current_user.get("mahasiswa_id")
    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    if not mahasiswa:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)

    if PembimbingRequest.find_pending_by_mahasiswa(mahasiswa_id, request_type="change"):
        return ResponseFormatter.error("Request pergantian sedang diproses", 400)

    if not User.find_by_id(requested_pembimbing_id):
        return ResponseFormatter.error("Dosen pembimbing tidak ditemukan", 404)

    current_slot_id = mahasiswa.get("pembimbing_1_id") if requested_slot == "pembimbing_1" else mahasiswa.get("pembimbing_2_id")
    if current_slot_id == requested_pembimbing_id:
        return ResponseFormatter.error("Dosen pembimbing baru tidak boleh sama dengan pembimbing saat ini", 400)

    request_doc = PembimbingRequest.create_change(
        mahasiswa_id=mahasiswa_id,
        requested_pembimbing_id=requested_pembimbing_id,
        requested_slot=requested_slot,
        alasan=alasan,
        current_pembimbing_1_id=mahasiswa.get("pembimbing_1_id"),
        current_pembimbing_2_id=mahasiswa.get("pembimbing_2_id"),
    )

    return ResponseFormatter.success(
        data=request_doc,
        message="Request pergantian pembimbing dikirim",
        status_code=201
    )


@mahasiswa_bp.post("/upload/<ttu_number>")
@token_required
@role_required("mahasiswa")
def upload(ttu_number):
    """Upload submission - file disimpan di database"""
    if ttu_number not in ["ttu_1", "ttu_2", "ttu_3"]:
        return ResponseFormatter.error("TTU harus: ttu_1, ttu_2, atau ttu_3", 400)
    
    if "file" not in request.files:
        return ResponseFormatter.error("File tidak ada", 400)
    
    file = request.files["file"]
    if file.filename == "":
        return ResponseFormatter.error("File tidak dipilih", 400)
    
    if not Validator.validate_file_extension(file.filename, ALLOWED_EXTENSIONS):
        return ResponseFormatter.error(f"File harus: {', '.join(ALLOWED_EXTENSIONS)}", 400)
    
    file_data = file.read()
    file_size = len(file_data)
    
    if not Validator.validate_file_size(file_size, MAX_FILE_SIZE_MB):
        return ResponseFormatter.error(f"File max {MAX_FILE_SIZE_MB}MB", 400)
    
    filename = secure_filename(file.filename)
    filename = Sanitizer.sanitize_filename(filename)
    content_type = file.content_type or mimetypes.guess_type(filename)[0] or "application/octet-stream"
    
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    if not mahasiswa:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)

    ttu_status = (mahasiswa.get("ttu_status") or {}).get(ttu_number, {})
    current_status = ttu_status.get("status")
    if current_status not in ["open", "needs_revision"]:
        return ResponseFormatter.error("TTU belum dibuka atau sudah selesai", 400)
    
    submission = Submission.create(
        mahasiswa_id=mahasiswa_id,
        ttu_number=ttu_number,
        file_name=filename,
        file_size=file_size,
        file_data=file_data,
        file_content_type=content_type,
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


@mahasiswa_bp.post("/upload-ttu3-requirement")
@token_required
@role_required("mahasiswa")
def upload_ttu3_requirement():
    """Upload berkas persyaratan TTU3 - file disimpan di database"""
    if "file" not in request.files:
        return ResponseFormatter.error("File tidak ada", 400)

    file = request.files["file"]
    if file.filename == "":
        return ResponseFormatter.error("File tidak dipilih", 400)

    if not Validator.validate_file_extension(file.filename, ALLOWED_REQUIREMENT_EXTENSIONS):
        return ResponseFormatter.error(f"File harus: {', '.join(ALLOWED_REQUIREMENT_EXTENSIONS)}", 400)

    file_data = file.read()
    file_size = len(file_data)

    if not Validator.validate_file_size(file_size, MAX_FILE_SIZE_MB):
        return ResponseFormatter.error(f"File max {MAX_FILE_SIZE_MB}MB", 400)

    filename = secure_filename(file.filename)
    filename = Sanitizer.sanitize_filename(filename)
    content_type = file.content_type or mimetypes.guess_type(filename)[0] or "application/octet-stream"

    mahasiswa_id = g.current_user.get("mahasiswa_id")
    requirement = TTU3Requirement.create(
        mahasiswa_id=mahasiswa_id,
        file_name=filename,
        file_size=file_size,
        file_data=file_data,
        file_content_type=content_type,
    )

    Mahasiswa.update_ttu3_requirement_status(mahasiswa_id, "submitted")

    return ResponseFormatter.success(
        data={"requirement_id": requirement["_id"]},
        message="Upload persyaratan TTU3 berhasil",
        status_code=201
    )


@mahasiswa_bp.get("/ttu3-requirement/status")
@token_required
@role_required("mahasiswa")
def ttu3_requirement_status():
    """Status berkas persyaratan TTU3"""
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    requirement = TTU3Requirement.get_by_mahasiswa(mahasiswa_id)
    return ResponseFormatter.success(
        data=requirement,
        message="Status persyaratan TTU3"
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


@mahasiswa_bp.get("/ttu/<ttu_number>/history")
@token_required
@role_required("mahasiswa")
def get_ttu_history(ttu_number):
    """Get submission history untuk specific TTU"""
    if ttu_number not in ["ttu_1", "ttu_2", "ttu_3"]:
        return ResponseFormatter.error("TTU harus: ttu_1, ttu_2, atau ttu_3", 400)
    
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    history = Submission.get_all_by_mahasiswa_ttu(mahasiswa_id, ttu_number)
    
    return ResponseFormatter.success(
        data=history,
        message=f"Total revisi: {len(history)}"
    )


@mahasiswa_bp.get("/ttu/all-history")
@token_required
@role_required("mahasiswa")
def get_all_ttu_history():
    """Get all submission history untuk semua TTU"""
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    
    all_history = []
    for ttu_num in ["ttu_1", "ttu_2", "ttu_3"]:
        history = Submission.get_all_by_mahasiswa_ttu(mahasiswa_id, ttu_num)
        all_history.extend(history)
    
    # Sort by uploaded_at descending (newest first)
    all_history.sort(key=lambda x: x.get("uploaded_at", ""), reverse=True)
    
    return ResponseFormatter.success(
        data=all_history,
        message=f"Total submission: {len(all_history)}"
    )


@mahasiswa_bp.delete("/ttu/<ttu_number>/cancel")
@token_required
@role_required("mahasiswa")
def cancel_submission(ttu_number):
    """Cancel submission (mahasiswa can cancel their own submitted file)"""
    if ttu_number not in ["ttu_1", "ttu_2", "ttu_3"]:
        return ResponseFormatter.error("TTU harus: ttu_1, ttu_2, atau ttu_3", 400)
    
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    
    # Cancel the submission
    success = Submission.cancel_by_mahasiswa(mahasiswa_id, ttu_number)
    
    if not success:
        return ResponseFormatter.error("Tidak ada submission yang dapat dibatalkan", 404)
    
    return ResponseFormatter.success(
        message="Submission berhasil dibatalkan. Anda dapat mengupload file baru."
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


@mahasiswa_bp.get("/submissions/<submission_id>/download")
@token_required
@role_required("mahasiswa")
def download_submission_file(submission_id):
    """Download file submission dari database"""
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    submission = Submission.get_by_id(submission_id)
    
    if not submission or submission.get("mahasiswa_id") != mahasiswa_id:
        return ResponseFormatter.error("Submission tidak ditemukan", 404)
    
    file_info = Submission.get_file_data(submission_id)
    if not file_info:
        return ResponseFormatter.error("File tidak ditemukan", 404)
    
    return Response(
        file_info["file_data"],
        mimetype=file_info["file_content_type"],
        headers={
            "Content-Disposition": f'inline; filename="{file_info["file_name"]}"',
            "Content-Length": str(len(file_info["file_data"])),
        }
    )


@mahasiswa_bp.get("/review-comments")
@token_required
@role_required("mahasiswa")
def get_review_comments():
    """Get review comments for this mahasiswa's TTU3"""
    mahasiswa_id = g.current_user.get("mahasiswa_id")
    comments = ReviewComment.get_by_mahasiswa(mahasiswa_id)
    return ResponseFormatter.success(data=comments, message=f"Total: {len(comments)}")


@mahasiswa_bp.post("/review-comments")
@token_required
@role_required("mahasiswa")
def post_review_comment():
    """Post a review comment as mahasiswa"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)

    message = (data.get("message") or "").strip()
    if not message:
        return ResponseFormatter.error("Pesan tidak boleh kosong", 400)

    mahasiswa_id = g.current_user.get("mahasiswa_id")
    mahasiswa = Mahasiswa.find_by_id(mahasiswa_id)
    if not mahasiswa:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)

    comment = ReviewComment.create(
        mahasiswa_id=mahasiswa_id,
        sender_id=mahasiswa_id,
        sender_name=mahasiswa.get("nama", "Mahasiswa"),
        sender_role="mahasiswa",
        message=message,
    )

    return ResponseFormatter.success(data=comment, message="Komentar dikirim", status_code=201)
