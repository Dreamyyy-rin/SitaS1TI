"""
TTU3 requirement upload model
"""
import base64
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
    def create(cls, mahasiswa_id: str, file_name: str, file_size: int,
               file_data: bytes, file_content_type: str = "application/octet-stream") -> dict:
        doc = {
            "_id": ObjectId(),
            "mahasiswa_id": mahasiswa_id,
            "file_name": file_name,
            "file_size": file_size,
            "file_data": base64.b64encode(file_data).decode("utf-8"),
            "file_content_type": file_content_type,
            "status": "submitted",
            "reviewed_by": None,
            "reviewed_at": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = cls.collection().insert_one(doc)
        doc["_id"] = str(result.inserted_id)
        doc.pop("file_data", None)
        return doc

    @classmethod
    def get_by_mahasiswa(cls, mahasiswa_id: str) -> Optional[dict]:
        doc = cls.collection().find_one({"mahasiswa_id": mahasiswa_id}, {"file_data": 0})
        return cls.to_dict(doc) if doc else None

    @classmethod
    def get_by_id(cls, requirement_id: str) -> Optional[dict]:
        try:
            doc = cls.collection().find_one({"_id": ObjectId(requirement_id)}, {"file_data": 0})
            return cls.to_dict(doc) if doc else None
        except:
            return None

    @classmethod
    def get_file_data(cls, requirement_id: str) -> Optional[dict]:
        """Get file data for download"""
        try:
            doc = cls.collection().find_one(
                {"_id": ObjectId(requirement_id)},
                {"file_data": 1, "file_name": 1, "file_content_type": 1}
            )
            if doc and doc.get("file_data"):
                return {
                    "file_data": base64.b64decode(doc["file_data"]),
                    "file_name": doc.get("file_name", "file"),
                    "file_content_type": doc.get("file_content_type", "application/octet-stream"),
                }
            return None
        except:
            return None

    @classmethod
    def list_all(cls, status: Optional[str] = None) -> List[dict]:
        query = {}
        if status:
            query["status"] = status
        docs = cls.collection().find(query, {"file_data": 0})
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
