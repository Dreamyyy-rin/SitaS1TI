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
    
    @classmethod
    def collection(cls):
        """Get mahasiswa collection"""
        db = BaseModel.db()
        return db[cls.COLLECTION]
    
    @classmethod
    def create(cls, nim: str, nama: str, email: str, password_hash: str, 
               prodi: str, angkatan: int, pembimbing_1_id: Optional[str] = None,
               pembimbing_2_id: Optional[str] = None,
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
            "pembimbing_1_id": pembimbing_1_id,
            "pembimbing_2_id": pembimbing_2_id,
            "reviewer_id": reviewer_id,
            "onboarding_status": "approved" if pembimbing_1_id else "pending",
            "ttu3_requirement": {
                "status": "not_submitted",
                "submitted_at": None,
                "reviewed_at": None,
            },
            "ttu_status": {
                "ttu_1": {"status": "open", "score": None, "submitted_at": None, "reviewed_at": None, "approved_at": None},
                "ttu_2": {"status": "locked", "score": None, "submitted_at": None, "reviewed_at": None, "approved_at": None},
                "ttu_3": {"status": "locked", "score": None, "submitted_at": None, "reviewed_at": None, "approved_at": None},
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
    def get_all(cls, status: str = None) -> List[dict]:
        """Get semua mahasiswa, bisa filter status (active/inactive/all)"""
        query = {}
        if status == "active":
            query["is_active"] = True
        elif status == "inactive":
            query["is_active"] = False
        # jika status == "all" atau None, tidak filter is_active
        docs = cls.collection().find(query)
        return cls.to_list(docs)

    @classmethod
    def get_by_prodi(cls, prodi: str) -> List[dict]:
        """Get mahasiswa by prodi"""
        docs = cls.collection().find({"prodi": prodi, "is_active": True})
        return cls.to_list(docs)

    @classmethod
    def get_by_pembimbing(cls, dosen_id: str) -> List[dict]:
        """Get mahasiswa where this dosen is pembimbing 1 or 2"""
        docs = cls.collection().find({
            "$or": [
                {"pembimbing_1_id": dosen_id},
                {"pembimbing_2_id": dosen_id},
            ],
            "is_active": True,
        })
        return cls.to_list(docs)

    @classmethod
    def get_by_reviewer(cls, dosen_id: str) -> List[dict]:
        """Get mahasiswa where this dosen is reviewer"""
        docs = cls.collection().find({
            "reviewer_id": dosen_id,
            "is_active": True,
        })
        return cls.to_list(docs)
    
    @classmethod
    def set_pembimbing_reviewer(cls, mahasiswa_id: str, pembimbing_1_id: str, 
                               reviewer_id: str, pembimbing_2_id: Optional[str] = None) -> bool:
        """Set pembimbing dan reviewer"""
        result = cls.collection().update_one(
            {"_id": ObjectId(mahasiswa_id)},
            {
                "$set": {
                    "pembimbing_1_id": pembimbing_1_id,
                    "pembimbing_2_id": pembimbing_2_id,
                    "reviewer_id": reviewer_id,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0

    @classmethod
    def set_pembimbing(cls, mahasiswa_id: str, pembimbing_1_id: str,
                       pembimbing_2_id: Optional[str] = None, judul: Optional[str] = None) -> bool:
        """Set pembimbing 1 & 2"""
        update_fields = {
            "pembimbing_1_id": pembimbing_1_id,
            "pembimbing_2_id": pembimbing_2_id,
            "onboarding_status": "approved",
            "updated_at": datetime.utcnow(),
        }
        
        if judul:
            update_fields["judul"] = judul
        
        result = cls.collection().update_one(
            {"_id": ObjectId(mahasiswa_id)},
            {"$set": update_fields}
        )
        return result.modified_count > 0

    @classmethod
    def update_pembimbing_slot(cls, mahasiswa_id: str, slot: str, dosen_id: Optional[str]) -> bool:
        """Update pembimbing slot (pembimbing_1 atau pembimbing_2)"""
        if slot not in ["pembimbing_1", "pembimbing_2"]:
            return False
        key = f"{slot}_id"
        result = cls.collection().update_one(
            {"_id": ObjectId(mahasiswa_id)},
            {
                "$set": {
                    key: dosen_id,
                    "updated_at": datetime.utcnow(),
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

    @classmethod
    def approve_ttu(cls, mahasiswa_id: str, ttu_number: str) -> bool:
        """Approve TTU and unlock next stage if applicable"""
        now = datetime.utcnow()
        update_fields = {
            f"ttu_status.{ttu_number}.status": "approved",
            f"ttu_status.{ttu_number}.approved_at": now,
            "updated_at": now,
        }

        # Unlock next stage
        if ttu_number == "ttu_1":
            update_fields["ttu_status.ttu_2.status"] = "open"
        elif ttu_number == "ttu_2":
            # TTU3 opens directly when TTU2 is approved
            update_fields["ttu_status.ttu_3.status"] = "open"

        result = cls.collection().update_one(
            {"_id": ObjectId(mahasiswa_id)},
            {"$set": update_fields}
        )

        # Also update the latest submission's status to "approved"
        if result.modified_count > 0:
            db = BaseModel.db()
            db["submissions"].update_many(
                {
                    "mahasiswa_id": mahasiswa_id,
                    "ttu_number": ttu_number,
                    "status": {"$in": ["submitted", "reviewed"]},
                },
                {"$set": {"status": "approved", "approved_at": now}}
            )

        return result.modified_count > 0

    @classmethod
    def update_ttu3_requirement_status(cls, mahasiswa_id: str, status: str) -> bool:
        """Update status persyaratan TTU3 dan unlock TTU3 jika TTU2 sudah approved"""
        now = datetime.utcnow()
        update_fields = {
            "ttu3_requirement.status": status,
            "ttu3_requirement.reviewed_at": now if status in ["approved", "rejected"] else None,
            "updated_at": now,
        }

        if status == "submitted":
            update_fields["ttu3_requirement.submitted_at"] = now

        # If approved, unlock TTU3 when TTU2 already approved
        if status == "approved":
            doc = cls.collection().find_one({"_id": ObjectId(mahasiswa_id)})
            ttu2_status = ((doc or {}).get("ttu_status") or {}).get("ttu_2", {}).get("status")
            if ttu2_status == "approved":
                update_fields["ttu_status.ttu_3.status"] = "open"

        result = cls.collection().update_one(
            {"_id": ObjectId(mahasiswa_id)},
            {"$set": update_fields}
        )
        return result.modified_count > 0
