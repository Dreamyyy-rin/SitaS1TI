"""
Models package
"""
from .base import BaseModel
from .user import User, UserRole
from .mahasiswa import Mahasiswa
from .submission import Submission
from .notification import Notification
from .pembimbing_request import PembimbingRequest
from .ttu3_requirement import TTU3Requirement

__all__ = [
    "BaseModel",
    "User",
    "UserRole",
    "Mahasiswa",
    "Submission",
    "Notification",
    "PembimbingRequest",
    "TTU3Requirement",
]
