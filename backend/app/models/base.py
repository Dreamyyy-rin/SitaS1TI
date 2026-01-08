"""
Base model class
"""
from datetime import datetime
from bson import ObjectId
from typing import Optional, List, Dict, Any


class BaseModel:
    """Base class untuk semua models"""
    
    @staticmethod
    def db():
        """Get database connection"""
        from ..db import get_db
        return get_db()
    
    @staticmethod
    def to_dict(doc: Dict[str, Any]) -> Dict[str, Any]:
        """Convert MongoDB document to dict dengan ObjectId as string"""
        if doc and "_id" in doc:
            doc["_id"] = str(doc["_id"])
        return doc
    
    @staticmethod
    def to_list(docs: List[Dict]) -> List[Dict]:
        """Convert list of MongoDB documents"""
        return [BaseModel.to_dict(doc) for doc in docs]
