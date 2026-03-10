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
               sender_role: str, message: str, chat_type: str = "review") -> dict:
        """
        Buat komentar baru.
        sender_role: 'mahasiswa' | 'pembimbing' | 'reviewer'
        chat_type: 'bimbingan' | 'review'
        """
        doc = {
            "_id": ObjectId(),
            "mahasiswa_id": mahasiswa_id,
            "sender_id": sender_id,
            "sender_name": sender_name,
            "sender_role": sender_role,
            "message": message,
            "chat_type": chat_type,
            "created_at": datetime.utcnow(),
        }
        result = cls.collection().insert_one(doc)
        doc["_id"] = str(result.inserted_id)
        return doc

    @classmethod
    def get_by_mahasiswa(cls, mahasiswa_id: str, chat_type: Optional[str] = None) -> List[dict]:
        """Get comments for a mahasiswa, optionally filtered by chat_type"""
        query: dict = {"mahasiswa_id": mahasiswa_id}
        if chat_type:
            # Support legacy docs (no chat_type field) as 'review'
            if chat_type == "review":
                query["$or"] = [
                    {"chat_type": "review"},
                    {"chat_type": {"$exists": False}},
                ]
            else:
                query["chat_type"] = chat_type
        docs = cls.collection().find(query).sort("created_at", 1)
        return cls.to_list(docs)

    @classmethod
    def delete_by_mahasiswa(cls, mahasiswa_id: str) -> int:
        """Delete all comments for a mahasiswa"""
        result = cls.collection().delete_many({"mahasiswa_id": mahasiswa_id})
        return result.deleted_count
