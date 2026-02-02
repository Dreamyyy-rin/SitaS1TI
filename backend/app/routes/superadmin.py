"""
Superadmin routes blueprint
"""
from flask import Blueprint, request
from ..auth import AuthService, token_required, role_required
from ..models import User, UserRole
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
    role_filter = request.args.get("role")
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
