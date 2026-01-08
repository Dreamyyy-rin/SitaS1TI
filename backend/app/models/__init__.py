"""
Models package
"""
from .base import BaseModel
from .user import User, UserRole
from .mahasiswa import Mahasiswa
from .submission import Submission
from .notification import Notification

__all__ = [
    "BaseModel",
    "User",
    "UserRole",
    "Mahasiswa",
    "Submission",
    "Notification",
]
