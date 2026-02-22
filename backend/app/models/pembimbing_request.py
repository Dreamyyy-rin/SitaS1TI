"""
Pembimbing request model (initial & change)
"""
from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from .base import BaseModel


class PembimbingRequest(BaseModel):
    """Model untuk request dosen pembimbing"""
    COLLECTION = "pembimbing_requests"

    @classmethod
    def collection(cls):
        db = BaseModel.db()
        return db[cls.COLLECTION]

    @classmethod
    def create_initial(cls, mahasiswa_id: str, pembimbing_1_id: str,
                       pembimbing_2_id: Optional[str] = None,
                       judul: Optional[str] = None) -> dict:
        """Create initial pembimbing request"""
        request_doc = {
            "_id": ObjectId(),
            "mahasiswa_id": mahasiswa_id,
            "request_type": "initial",
            "requested_pembimbing_1_id": pembimbing_1_id,
            "requested_pembimbing_2_id": pembimbing_2_id,
            "requested_slot": None,
            "judul": judul,
            "alasan": None,
            "status_kaprodi": "pending",
            "status_dosen_1": "pending",
            "status_dosen_2": "approved" if not pembimbing_2_id else "pending",
            "overall_status": "pending",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = cls.collection().insert_one(request_doc)
        request_doc["_id"] = str(result.inserted_id)
        return request_doc

    @classmethod
    def create_change(cls, mahasiswa_id: str, requested_pembimbing_id: str,
                      requested_slot: str, alasan: str,
                      current_pembimbing_1_id: Optional[str] = None,
                      current_pembimbing_2_id: Optional[str] = None,
                      judul: Optional[str] = None) -> dict:
        """Create change pembimbing request"""
        request_doc = {
            "_id": ObjectId(),
            "mahasiswa_id": mahasiswa_id,
            "request_type": "change",
            "requested_pembimbing_1_id": requested_pembimbing_id,
            "requested_pembimbing_2_id": None,
            "requested_slot": requested_slot,
            "current_pembimbing_1_id": current_pembimbing_1_id,
            "current_pembimbing_2_id": current_pembimbing_2_id,
            "judul": judul,
            "alasan": alasan,
            "status_kaprodi": "pending",
            "status_dosen_1": "pending",
            "status_dosen_2": "approved",
            "overall_status": "pending",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = cls.collection().insert_one(request_doc)
        request_doc["_id"] = str(result.inserted_id)
        return request_doc

    @classmethod
    def find_by_id(cls, request_id: str) -> Optional[dict]:
        try:
            doc = cls.collection().find_one({"_id": ObjectId(request_id)})
            return cls.to_dict(doc) if doc else None
        except:
            return None

    @classmethod
    def find_pending_by_mahasiswa(cls, mahasiswa_id: str, request_type: Optional[str] = None) -> Optional[dict]:
        query = {
            "mahasiswa_id": mahasiswa_id,
            "overall_status": "pending",
        }
        if request_type:
            query["request_type"] = request_type
        doc = cls.collection().find_one(query)
        return cls.to_dict(doc) if doc else None

    @classmethod
    def list_by_dosen(cls, dosen_id: str, request_type: Optional[str] = None) -> List[dict]:
        query = {
            "overall_status": "pending",
            "$or": [
                {"requested_pembimbing_1_id": dosen_id},
                {"requested_pembimbing_2_id": dosen_id},
            ],
        }
        if request_type:
            query["request_type"] = request_type
        docs = cls.collection().find(query)
        return cls.to_list(docs)

    @classmethod
    def list_by_mahasiswa_ids(cls, mahasiswa_ids: List[str], request_type: Optional[str] = None) -> List[dict]:
        query = {
            "overall_status": "pending",
            "mahasiswa_id": {"$in": mahasiswa_ids},
        }
        if request_type:
            query["request_type"] = request_type
        docs = cls.collection().find(query)
        return cls.to_list(docs)

    @classmethod
    def update_status(cls, request_id: str, status_updates: dict) -> bool:
        result = cls.collection().update_one(
            {"_id": ObjectId(request_id)},
            {
                "$set": {
                    **status_updates,
                    "updated_at": datetime.utcnow(),
                }
            }
        )
        return result.modified_count > 0

    @staticmethod
    def compute_overall_status(request_doc: dict) -> str:
        statuses = [
            request_doc.get("status_kaprodi"),
            request_doc.get("status_dosen_1"),
            request_doc.get("status_dosen_2"),
        ]
        if "rejected" in statuses:
            return "rejected"
        if all(s == "approved" for s in statuses):
            return "approved"
        return "pending"
