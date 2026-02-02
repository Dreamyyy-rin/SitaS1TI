"""
User model - untuk Superadmin, Kaprodi, Dosen
"""
from datetime import datetime
from typing import Optional, List
from enum import Enum
from bson import ObjectId
from .base import BaseModel


class UserRole(str, Enum):
    SUPERADMIN = "superadmin"
    KAPRODI = "kaprodi"
    DOSEN = "dosen"


class User(BaseModel):
    """Model untuk User (Superadmin, Kaprodi, Dosen)"""
    COLLECTION = "users"
    
    @classmethod
    def collection(cls):
        """Get users collection"""
        db = BaseModel.db()
        return db[cls.COLLECTION]
    
    @classmethod
    def create(cls, email: str, password_hash: str, nama: str, role: UserRole, 
               nidn: Optional[str] = None, prodi: Optional[str] = None) -> dict:
        """Buat user baru"""
        user = {
            "_id": ObjectId(),
            "email": email,
            "password_hash": password_hash,
            "nama": nama,
            "role": role,
            "nidn": nidn,
            "prodi": prodi,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        
        result = cls.collection().insert_one(user)
        user["_id"] = str(result.inserted_id)
        return user
    
    @classmethod
    def find_by_email(cls, email: str) -> Optional[dict]:
        """Cari user berdasarkan email"""
        doc = cls.collection().find_one({"email": email})
        return cls.to_dict(doc) if doc else None
    
    @classmethod
    def find_by_id(cls, user_id: str) -> Optional[dict]:
        """Cari user berdasarkan ID"""
        try:
            doc = cls.collection().find_one({"_id": ObjectId(user_id)})
            return cls.to_dict(doc) if doc else None
        except:
            return None
    
    @classmethod
    def get_all(cls, role: Optional[str] = None) -> List[dict]:
        """Get semua users"""
        query = {"is_active": True}
        if role:
            query["role"] = role
        
        docs = cls.collection().find(query, {"password_hash": 0})
        return cls.to_list(docs)
    
    @classmethod
    def delete(cls, user_id: str) -> bool:
        """Soft delete user"""
        result = cls.collection().update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0
