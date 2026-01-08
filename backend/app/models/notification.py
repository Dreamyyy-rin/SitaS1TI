"""
Notification model
"""
from datetime import datetime
from typing import List
from bson import ObjectId
from .base import BaseModel


class Notification(BaseModel):
    """Model untuk Notification/Email Queue"""
    COLLECTION = "notifications"
    DB_NAME = "sita_users"
    
    @classmethod
    def collection(cls):
        """Get notifications collection"""
        from ..db import get_db
        db = get_db(cls.DB_NAME)
        return db[cls.COLLECTION]
    
    @classmethod
    def create(cls, recipient_email: str, recipient_name: str, subject: str, 
               body: str, event_type: str) -> dict:
        """Buat notification baru"""
        notification = {
            "_id": ObjectId(),
            "recipient_email": recipient_email,
            "recipient_name": recipient_name,
            "subject": subject,
            "body": body,
            "event_type": event_type,
            "is_sent": False,
            "sent_at": None,
            "created_at": datetime.utcnow(),
        }
        
        result = cls.collection().insert_one(notification)
        notification["_id"] = str(result.inserted_id)
        return notification
    
    @classmethod
    def get_unsent(cls) -> List[dict]:
        """Get unsent notifications"""
        docs = cls.collection().find({"is_sent": False})
        return cls.to_list(docs)
    
    @classmethod
    def mark_sent(cls, notification_id: str) -> bool:
        """Mark as sent"""
        result = cls.collection().update_one(
            {"_id": ObjectId(notification_id)},
            {
                "$set": {
                    "is_sent": True,
                    "sent_at": datetime.utcnow(),
                }
            }
        )
        return result.modified_count > 0
