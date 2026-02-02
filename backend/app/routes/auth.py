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
