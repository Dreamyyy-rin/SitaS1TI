"""
Auth routes blueprint
"""
from flask import Blueprint, request
from ..auth import AuthService, token_required, role_required
from ..models import User, Mahasiswa
from ..utils import Sanitizer, Validator, ResponseFormatter

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/login")
def login():
    """Login untuk dosen/kaprodi/superadmin"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
    email = data.get("email", "").strip()
    password = data.get("password", "")
    
    if not email or not password:
        return ResponseFormatter.error("Email dan password wajib", 400)
    
    if not Validator.validate_email(email):
        return ResponseFormatter.error("Email tidak valid", 400)
    
    token, user_data, error = AuthService.login_user(email, password, is_mahasiswa=False)
    
    if error:
        return ResponseFormatter.error(error, 401)
    
    return ResponseFormatter.success(
        data={"token": token, "user": user_data},
        message="Login berhasil"
    )


@auth_bp.post("/login-mahasiswa")
def login_mahasiswa():
    """Login mahasiswa"""
    data = request.get_json(force=True) or {}
    data = Sanitizer.sanitize_dict(data)
    
    email = data.get("email", "").strip()
    password = data.get("password", "")
    
    if not email or not password:
        return ResponseFormatter.error("Email dan password wajib", 400)
    
    token, user_data, error = AuthService.login_user(email, password, is_mahasiswa=True)
    
    if error:
        return ResponseFormatter.error(error, 401)
    
    return ResponseFormatter.success(
        data={"token": token, "user": user_data},
        message="Login mahasiswa berhasil"
    )


@auth_bp.post("/change-password")
@token_required
def change_password():
    """Ganti password user/mahasiswa"""
    data = request.get_json(force=True) or {}
    old_password = data.get("old_password", "")
    new_password = data.get("new_password", "")
    
    if not old_password or not new_password:
        return ResponseFormatter.error("Password lama dan baru wajib diisi", 400)
    
    if len(new_password) < 8:
        return ResponseFormatter.error("Password baru minimal 8 karakter", 400)
    
    from flask import g
    role = g.current_user.get("role")
    email = g.current_user.get("email")
    
    if role == "mahasiswa":
        user = Mahasiswa.find_by_email(email)
    else:
        user = User.find_by_email(email)
    
    if not user:
        return ResponseFormatter.error("User tidak ditemukan", 404)
    
    if not AuthService.verify_password(old_password, user.get("password_hash", "")):
        return ResponseFormatter.error("Password lama salah", 401)
    
    new_hash = AuthService.hash_password(new_password)
    
    from ..db import get_db
    from bson import ObjectId
    from datetime import datetime
    
    db = get_db()
    collection = "mahasiswa" if role == "mahasiswa" else "users"
    db[collection].update_one(
        {"_id": ObjectId(user["_id"])},
        {"$set": {"password_hash": new_hash, "updated_at": datetime.utcnow()}}
    )
    
    return ResponseFormatter.success(message="Password berhasil diubah")
