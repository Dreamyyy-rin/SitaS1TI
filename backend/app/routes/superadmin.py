"""
Superadmin routes blueprint
"""
from flask import Blueprint, request, g
from datetime import datetime
from bson import ObjectId
from ..auth import AuthService, token_required, role_required
from ..models import User, UserRole, TTU3Requirement, Mahasiswa, Notification
from ..utils import Sanitizer, Validator, ResponseFormatter

superadmin_bp = Blueprint("superadmin", __name__, url_prefix="/api/superadmin")


@superadmin_bp.post("/register-user")
@token_required
@role_required("superadmin")
def register_user():
    """Register user baru (dosen/kaprodi)"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
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
    
    if User.find_by_email(email):
        return ResponseFormatter.error("Email sudah terdaftar", 400)
    
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


@superadmin_bp.get("/users")
@token_required
@role_required("superadmin")
def list_users():
    """List semua users"""
    role_filter = Sanitizer.sanitize_query_value(request.args.get("role"))
    users = User.get_all(role=role_filter)
    
    return ResponseFormatter.success(
        data=users,
        message=f"Total users: {len(users)}"
    )


@superadmin_bp.delete("/users/<user_id>")
@token_required
@role_required("superadmin")
def delete_user(user_id):
    """Delete user"""
    if User.delete(user_id):
        return ResponseFormatter.success(message="User berhasil dihapus")
    return ResponseFormatter.error("User tidak ditemukan", 404)


@superadmin_bp.put("/users/<user_id>")
@token_required
@role_required("superadmin")
def update_user(user_id):
    """Update user dosen/kaprodi"""
    existing = User.find_by_id(user_id)
    if not existing:
        return ResponseFormatter.error("User tidak ditemukan", 404)

    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)

    update_doc = {}

    if "nama" in data:
        nama = (data.get("nama") or "").strip()
        if not nama:
            return ResponseFormatter.error("Nama tidak boleh kosong", 400)
        update_doc["nama"] = nama

    if "nidn" in data:
        nidn = (data.get("nidn") or "").strip()
        if not Validator.validate_nidn(nidn):
            return ResponseFormatter.error("NIDN harus 10 digit", 400)
        update_doc["nidn"] = nidn

    if "prodi" in data:
        prodi = (data.get("prodi") or "").strip()
        update_doc["prodi"] = prodi

    if "is_active" in data:
        update_doc["is_active"] = bool(data.get("is_active"))

    new_password = (data.get("password") or "").strip()
    if new_password:
        if len(new_password) < 8:
            return ResponseFormatter.error("Password minimal 8 karakter", 400)
        update_doc["password_hash"] = AuthService.hash_password(new_password)

    if not update_doc:
        return ResponseFormatter.error("Tidak ada data yang diperbarui", 400)

    update_doc["updated_at"] = datetime.utcnow()

    result = User.collection().update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_doc}
    )

    if result.matched_count == 0:
        return ResponseFormatter.error("User tidak ditemukan", 404)

    return ResponseFormatter.success(message="User berhasil diperbarui")


@superadmin_bp.get("/mahasiswa")
@token_required
@role_required("superadmin")
def list_mahasiswa():
    """List semua mahasiswa"""
    mahasiswa_list = Mahasiswa.get_all()
    for m in mahasiswa_list:
        m.pop("password_hash", None)
    return ResponseFormatter.success(
        data=mahasiswa_list,
        message=f"Total mahasiswa: {len(mahasiswa_list)}"
    )


@superadmin_bp.post("/register-mahasiswa")
@token_required
@role_required("superadmin")
def register_mahasiswa():
    """Register mahasiswa baru"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
    required_fields = ["email", "password", "nama", "nim"]
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return ResponseFormatter.error(f"Field wajib: {', '.join(missing)}", 400)
    
    email = data.get("email", "").strip()
    nama = data.get("nama", "").strip()
    nim = data.get("nim", "").strip()
    prodi = data.get("prodi", "Teknik Informatika").strip()
    angkatan = data.get("angkatan", 2022)
    password = data.get("password", "")
    
    if not Validator.validate_email(email):
        return ResponseFormatter.error("Email tidak valid", 400)
    
    if not password or len(password) < 8:
        return ResponseFormatter.error("Password minimal 8 karakter", 400)
    
    if Mahasiswa.find_by_email(email):
        return ResponseFormatter.error("Email sudah terdaftar", 400)
    
    if Mahasiswa.find_by_nim(nim):
        return ResponseFormatter.error("NIM sudah terdaftar", 400)
    
    password_hash = AuthService.hash_password(password)
    mahasiswa = Mahasiswa.create(
        email=email,
        password_hash=password_hash,
        nama=nama,
        nim=nim,
        prodi=prodi,
        angkatan=angkatan,
    )
    
    return ResponseFormatter.success(
        data={"mahasiswa_id": mahasiswa["_id"], "email": mahasiswa["email"]},
        message="Mahasiswa berhasil dibuat",
        status_code=201
    )


@superadmin_bp.delete("/mahasiswa/<mahasiswa_id>")
@token_required
@role_required("superadmin")
def delete_mahasiswa(mahasiswa_id):
    """Delete mahasiswa"""
    from ..db import get_db
    from bson import ObjectId
    db = get_db()
    result = db["mahasiswa"].delete_one({"_id": ObjectId(mahasiswa_id)})
    if result.deleted_count > 0:
        return ResponseFormatter.success(message="Mahasiswa berhasil dihapus")
    return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)


@superadmin_bp.put("/mahasiswa/<mahasiswa_id>")
@token_required
@role_required("superadmin")
def update_mahasiswa(mahasiswa_id):
    """Update data mahasiswa"""
    existing = Mahasiswa.find_by_id(mahasiswa_id)
    if not existing:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)

    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)

    update_doc = {}

    if "nama" in data:
        nama = (data.get("nama") or "").strip()
        if not nama:
            return ResponseFormatter.error("Nama tidak boleh kosong", 400)
        update_doc["nama"] = nama

    if "nim" in data:
        nim = (data.get("nim") or "").strip()
        if not nim:
            return ResponseFormatter.error("NIM tidak boleh kosong", 400)

        nim_owner = Mahasiswa.find_by_nim(nim)
        if nim_owner and nim_owner.get("_id") != mahasiswa_id:
            return ResponseFormatter.error("NIM sudah terdaftar", 400)
        update_doc["nim"] = nim

    if "prodi" in data:
        prodi = (data.get("prodi") or "").strip()
        update_doc["prodi"] = prodi

    if "is_active" in data:
        update_doc["is_active"] = bool(data.get("is_active"))

    new_password = (data.get("password") or "").strip()
    if new_password:
        if len(new_password) < 8:
            return ResponseFormatter.error("Password minimal 8 karakter", 400)
        update_doc["password_hash"] = AuthService.hash_password(new_password)

    if not update_doc:
        return ResponseFormatter.error("Tidak ada data yang diperbarui", 400)

    update_doc["updated_at"] = datetime.utcnow()

    result = Mahasiswa.collection().update_one(
        {"_id": ObjectId(mahasiswa_id)},
        {"$set": update_doc}
    )

    if result.matched_count == 0:
        return ResponseFormatter.error("Mahasiswa tidak ditemukan", 404)

    return ResponseFormatter.success(message="Mahasiswa berhasil diperbarui")


@superadmin_bp.get("/ttu3-requirements")
@token_required
@role_required("superadmin")
def list_ttu3_requirements():
    """List berkas persyaratan TTU3"""
    status = Sanitizer.sanitize_query_value(request.args.get("status"))
    requirements = TTU3Requirement.list_all(status=status)

    # Enrich with mahasiswa info
    mahasiswa_map = {}
    for req in requirements:
        m_id = req.get("mahasiswa_id")
        if m_id and m_id not in mahasiswa_map:
            mahasiswa_map[m_id] = Mahasiswa.find_by_id(m_id)

    for req in requirements:
        m = mahasiswa_map.get(req.get("mahasiswa_id")) or {}
        req["mahasiswa_nama"] = m.get("nama", "-")
        req["mahasiswa_nim"] = m.get("nim", "-")

    return ResponseFormatter.success(
        data=requirements,
        message=f"Total berkas: {len(requirements)}"
    )


@superadmin_bp.post("/ttu3-requirements/<requirement_id>/approve")
@token_required
@role_required("superadmin")
def approve_ttu3_requirement(requirement_id):
    """ACC berkas persyaratan TTU3"""
    requirement = TTU3Requirement.get_by_id(requirement_id)
    if not requirement:
        return ResponseFormatter.error("Berkas tidak ditemukan", 404)

    if TTU3Requirement.update_status(requirement_id, "approved", reviewed_by=g.current_user.get("user_id")):
        Mahasiswa.update_ttu3_requirement_status(requirement.get("mahasiswa_id"), "approved")
        mahasiswa = Mahasiswa.find_by_id(requirement.get("mahasiswa_id"))
        if mahasiswa:
            Notification.create(
                recipient_email=mahasiswa.get("email"),
                recipient_name=mahasiswa.get("nama"),
                subject="Persyaratan TTU3 disetujui",
                body="Berkas persyaratan TTU3 Anda telah disetujui. Anda dapat melanjutkan TTU 3.",
                event_type="ttu3_req_approved",
            )
        return ResponseFormatter.success(message="Berkas disetujui")

    return ResponseFormatter.error("Gagal memperbarui berkas", 400)


@superadmin_bp.post("/ttu3-requirements/<requirement_id>/reject")
@token_required
@role_required("superadmin")
def reject_ttu3_requirement(requirement_id):
    """Tolak berkas persyaratan TTU3"""
    requirement = TTU3Requirement.get_by_id(requirement_id)
    if not requirement:
        return ResponseFormatter.error("Berkas tidak ditemukan", 404)

    if TTU3Requirement.update_status(requirement_id, "rejected", reviewed_by=g.current_user.get("user_id")):
        Mahasiswa.update_ttu3_requirement_status(requirement.get("mahasiswa_id"), "rejected")
        mahasiswa = Mahasiswa.find_by_id(requirement.get("mahasiswa_id"))
        if mahasiswa:
            Notification.create(
                recipient_email=mahasiswa.get("email"),
                recipient_name=mahasiswa.get("nama"),
                subject="Persyaratan TTU3 ditolak",
                body="Berkas persyaratan TTU3 Anda ditolak. Silakan unggah ulang.",
                event_type="ttu3_req_rejected",
            )
        return ResponseFormatter.success(message="Berkas ditolak")

    return ResponseFormatter.error("Gagal memperbarui berkas", 400)
