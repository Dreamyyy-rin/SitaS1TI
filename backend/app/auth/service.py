"""
Authentication service
"""
import jwt
from datetime import datetime, timedelta
from typing import Optional, Tuple
from werkzeug.security import generate_password_hash, check_password_hash
from ..config import settings
from ..models import User, Mahasiswa


class AuthService:
    """Service untuk authentication"""
    
    JWT_ALGORITHM = "HS256"
    TOKEN_EXPIRY_HOURS = 24
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password"""
        return generate_password_hash(password, method='pbkdf2:sha256')
    
    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        """Verify password"""
        return check_password_hash(password_hash, password)
    
    @staticmethod
    def create_token(user_id: str, email: str, role: str, nama: str, 
                    mahasiswa_id: Optional[str] = None, nim: Optional[str] = None) -> str:
        """Create JWT token"""
        payload = {
            "user_id": user_id,
            "email": email,
            "role": role,
            "nama": nama,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(hours=AuthService.TOKEN_EXPIRY_HOURS),
        }
        
        if mahasiswa_id:
            payload["mahasiswa_id"] = mahasiswa_id
        if nim:
            payload["nim"] = nim
        
        token = jwt.encode(
            payload,
            settings.secret_key,
            algorithm=AuthService.JWT_ALGORITHM
        )
        return token
    
    @staticmethod
    def verify_token(token: str) -> Optional[dict]:
        """Verify JWT token"""
        try:
            payload = jwt.decode(
                token,
                settings.secret_key,
                algorithms=[AuthService.JWT_ALGORITHM]
            )
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def login_user(email: str, password: str, is_mahasiswa: bool = False) -> Tuple[Optional[str], Optional[dict], Optional[str]]:
        """Login user"""
        if is_mahasiswa:
            user = Mahasiswa.find_by_email(email)
            role = "mahasiswa"
            
            if not user or not user.get("is_active"):
                return None, None, "Mahasiswa tidak ditemukan atau tidak aktif"
            
            if not AuthService.verify_password(password, user.get("password_hash", "")):
                return None, None, "Password salah"
            
            token = AuthService.create_token(
                user_id=user["_id"],
                email=user["email"],
                role=role,
                nama=user["nama"],
                mahasiswa_id=user["_id"],
                nim=user.get("nim")
            )
            
            user_data = {
                "mahasiswa_id": user["_id"],
                "email": user["email"],
                "nama": user["nama"],
                "role": role,
                "nim": user.get("nim"),
                "prodi": user.get("prodi"),
            }
        else:
            user = User.find_by_email(email)
            
            if not user or not user.get("is_active"):
                return None, None, "User tidak ditemukan atau tidak aktif"
            
            if not AuthService.verify_password(password, user.get("password_hash", "")):
                return None, None, "Password salah"
            
            role = user.get("role")
            
            token = AuthService.create_token(
                user_id=user["_id"],
                email=user["email"],
                role=role,
                nama=user["nama"]
            )
            
            user_data = {
                "user_id": user["_id"],
                "email": user["email"],
                "nama": user["nama"],
                "role": role,
            }
            
            if role == "kaprodi":
                user_data["prodi"] = user.get("prodi")
            else:
                user_data["nidn"] = user.get("nidn")
        
        return token, user_data, None
