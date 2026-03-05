"""
Review Comment model - chat between mahasiswa, pembimbing, and reviewer for TTU3 review
"""
from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from .base import BaseModel


class ReviewComment(BaseModel):
    """Model untuk komentar review TTU3 (chat pembimbing, reviewer, mahasiswa)"""
    COLLECTION = "review_comments"

    @classmethod
    def collection(cls):
        db = BaseModel.db()
        return db[cls.COLLECTION]

    @classmethod
    def create(cls, mahasiswa_id: str, sender_id: str, sender_name: str,
               sender_role: str, message: str) -> dict:
        """
        Buat komentar baru.
        sender_role: 'mahasiswa' | 'pembimbing' | 'reviewer'
        """
        doc = {
            "_id": ObjectId(),
            "mahasiswa_id": mahasiswa_id,
            "sender_id": sender_id,
            "sender_name": sender_name,
            "sender_role": sender_role,
            "message": message,
            "created_at": datetime.utcnow(),
        }
        result = cls.collection().insert_one(doc)
        doc["_id"] = str(result.inserted_id)
        return doc

    @classmethod
    def get_by_mahasiswa(cls, mahasiswa_id: str) -> List[dict]:
        """Get all comments for a mahasiswa's TTU3 review, sorted by time asc"""
        docs = cls.collection().find(
            {"mahasiswa_id": mahasiswa_id}
        ).sort("created_at", 1)
        return cls.to_list(docs)

    @classmethod
    def delete_by_mahasiswa(cls, mahasiswa_id: str) -> int:
        """Delete all comments for a mahasiswa"""
        result = cls.collection().delete_many({"mahasiswa_id": mahasiswa_id})
        return result.deleted_count
