"""
Mahasiswa model
"""
from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from .base import BaseModel


class Mahasiswa(BaseModel):
    """Model untuk Mahasiswa"""
    COLLECTION = "mahasiswa"
    DB_NAME = "sita_mahasiswa"
    
    @classmethod
    def collection(cls):
        """Get mahasiswa collection"""
        from ..db import get_db
        db = get_db(cls.DB_NAME)
        return db[cls.COLLECTION]
    
    @classmethod
    def create(cls, nim: str, nama: str, email: str, password_hash: str, 
               prodi: str, angkatan: int, pembimbing_id: Optional[str] = None,
               reviewer_id: Optional[str] = None) -> dict:
        """Buat mahasiswa baru"""
        mahasiswa = {
            "_id": ObjectId(),
            "nim": nim,
            "nama": nama,
            "email": email,
            "password_hash": password_hash,
            "prodi": prodi,
            "angkatan": angkatan,
            "pembimbing_id": pembimbing_id,
            "reviewer_id": reviewer_id,
            "ttu_status": {
                "ttu_1": {"status": "open", "score": None, "submitted_at": None, "reviewed_at": None},
                "ttu_2": {"status": "open", "score": None, "submitted_at": None, "reviewed_at": None},
                "ttu_3": {"status": "open", "score": None, "submitted_at": None, "reviewed_at": None},
            },
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        
        result = cls.collection().insert_one(mahasiswa)
        mahasiswa["_id"] = str(result.inserted_id)
        return mahasiswa
    
    @classmethod
    def find_by_nim(cls, nim: str) -> Optional[dict]:
        """Cari mahasiswa berdasarkan NIM"""
        doc = cls.collection().find_one({"nim": nim})
        return cls.to_dict(doc) if doc else None
    
    @classmethod
    def find_by_email(cls, email: str) -> Optional[dict]:
        """Cari mahasiswa berdasarkan email"""
        doc = cls.collection().find_one({"email": email})
        return cls.to_dict(doc) if doc else None
    
    @classmethod
    def find_by_id(cls, mahasiswa_id: str) -> Optional[dict]:
        """Cari mahasiswa berdasarkan ID"""
        try:
            doc = cls.collection().find_one({"_id": ObjectId(mahasiswa_id)})
            return cls.to_dict(doc) if doc else None
        except:
            return None
    
    @classmethod
    def get_by_prodi(cls, prodi: str) -> List[dict]:
        """Get mahasiswa by prodi"""
        docs = cls.collection().find({"prodi": prodi, "is_active": True})
        return cls.to_list(docs)
    
    @classmethod
    def set_pembimbing_reviewer(cls, mahasiswa_id: str, pembimbing_id: str, 
                               reviewer_id: str) -> bool:
        """Set pembimbing dan reviewer"""
        result = cls.collection().update_one(
            {"_id": ObjectId(mahasiswa_id)},
            {
                "$set": {
                    "pembimbing_id": pembimbing_id,
                    "reviewer_id": reviewer_id,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    
    @classmethod
    def update_ttu_status(cls, mahasiswa_id: str, ttu_number: str, 
                         new_status: str) -> bool:
        """Update TTU status"""
        ttu_key = f"ttu_status.{ttu_number}.status"
        result = cls.collection().update_one(
            {"_id": ObjectId(mahasiswa_id)},
            {
                "$set": {
                    ttu_key: new_status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
