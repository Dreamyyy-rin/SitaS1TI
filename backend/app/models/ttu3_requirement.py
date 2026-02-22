"""
TTU3 requirement upload model
"""
from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from .base import BaseModel


class TTU3Requirement(BaseModel):
    """Model untuk berkas persyaratan TTU3"""
    COLLECTION = "ttu3_requirements"

    @classmethod
    def collection(cls):
        db = BaseModel.db()
        return db[cls.COLLECTION]

    @classmethod
    def create(cls, mahasiswa_id: str, file_path: str, file_name: str, file_size: int) -> dict:
        doc = {
            "_id": ObjectId(),
            "mahasiswa_id": mahasiswa_id,
            "file_name": file_name,
            "file_path": file_path,
            "file_size": file_size,
            "status": "submitted",
            "reviewed_by": None,
            "reviewed_at": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = cls.collection().insert_one(doc)
        doc["_id"] = str(result.inserted_id)
        return doc

    @classmethod
    def get_by_mahasiswa(cls, mahasiswa_id: str) -> Optional[dict]:
        doc = cls.collection().find_one({"mahasiswa_id": mahasiswa_id})
        return cls.to_dict(doc) if doc else None

    @classmethod
    def get_by_id(cls, requirement_id: str) -> Optional[dict]:
        try:
            doc = cls.collection().find_one({"_id": ObjectId(requirement_id)})
            return cls.to_dict(doc) if doc else None
        except:
            return None

    @classmethod
    def list_all(cls, status: Optional[str] = None) -> List[dict]:
        query = {}
        if status:
            query["status"] = status
        docs = cls.collection().find(query)
        return cls.to_list(docs)

    @classmethod
    def update_status(cls, requirement_id: str, status: str, reviewed_by: Optional[str] = None) -> bool:
        result = cls.collection().update_one(
            {"_id": ObjectId(requirement_id)},
            {
                "$set": {
                    "status": status,
                    "reviewed_by": reviewed_by,
                    "reviewed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                }
            }
        )
        return result.modified_count > 0
