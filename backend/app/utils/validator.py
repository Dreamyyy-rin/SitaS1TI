"""
Validation utilities
"""
import re
from typing import Tuple, Optional


class Validator:
    """Input validation"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def validate_password(password: str) -> Tuple[bool, Optional[str]]:
        """Validate password strength"""
        if len(password) < 8:
            return False, "Password minimal 8 karakter"
        
        if not re.search(r'[a-z]', password):
            return False, "Password harus mengandung huruf kecil"
        
        if not re.search(r'[A-Z]', password):
            return False, "Password harus mengandung huruf besar"
        
        if not re.search(r'[0-9]', password):
            return False, "Password harus mengandung angka"
        
        return True, None
    
    @staticmethod
    def validate_nim(nim: str) -> bool:
        """Validate NIM"""
        return bool(re.match(r'^\d{6,}$', nim.strip()))
    
    @staticmethod
    def validate_nidn(nidn: str) -> bool:
        """Validate NIDN"""
        return bool(re.match(r'^\d{10}$', nidn.strip()))
    
    @staticmethod
    def validate_file_extension(filename: str, allowed_extensions: list) -> bool:
        """Validate file extension"""
        if not filename:
            return False
        
        ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
        return ext in allowed_extensions
    
    @staticmethod
    def validate_file_size(file_size: int, max_size_mb: int = 50) -> bool:
        """Validate file size"""
        max_bytes = max_size_mb * 1024 * 1024
        return 0 < file_size <= max_bytes
