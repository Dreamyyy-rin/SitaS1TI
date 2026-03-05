"""
Submission model
"""
import base64
from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from .base import BaseModel


class Submission(BaseModel):
    """Model untuk Submission/Upload"""
    COLLECTION = "submissions"
    
    @classmethod
    def collection(cls):
        """Get submissions collection"""
        db = BaseModel.db()
        return db[cls.COLLECTION]
    
    @classmethod
    def mahasiswa_collection(cls):
        """Get mahasiswa collection (for updates)"""
        db = BaseModel.db()
        return db["mahasiswa"]
    
    @classmethod
    def create(cls, mahasiswa_id: str, ttu_number: str, file_name: str,
               file_size: int, file_data: bytes, file_content_type: str = "application/octet-stream") -> dict:
        """Buat submission baru - file disimpan sebagai binary di DB"""
        submission = {
            "_id": ObjectId(),
            "mahasiswa_id": mahasiswa_id,
            "ttu_number": ttu_number,
            "file_name": file_name,
            "file_size": file_size,
            "file_data": base64.b64encode(file_data).decode("utf-8"),
            "file_content_type": file_content_type,
            "uploaded_at": datetime.utcnow(),
            "status": "submitted",
            "comments": [],
        }
        
        result = cls.collection().insert_one(submission)
        
        # Update mahasiswa ttu_status
        cls.mahasiswa_collection().update_one(
            {"_id": ObjectId(mahasiswa_id)},
            {
                "$set": {
                    f"ttu_status.{ttu_number}.status": "submitted",
                    f"ttu_status.{ttu_number}.submitted_at": datetime.utcnow(),
                }
            }
        )
        
        submission["_id"] = str(result.inserted_id)
        submission.pop("file_data", None)
        return submission
    
    @classmethod
    def _strip_file_data(cls, doc: dict) -> dict:
        """Strip file_data from document for listing (too large)"""
        if doc:
            doc.pop("file_data", None)
        return doc

    @classmethod
    def get_by_mahasiswa_ttu(cls, mahasiswa_id: str, ttu_number: str) -> Optional[dict]:
        """Get latest submission by mahasiswa & TTU (without file_data)"""
        doc = cls.collection().find_one(
            {"mahasiswa_id": mahasiswa_id, "ttu_number": ttu_number},
            {"file_data": 0},
            sort=[("uploaded_at", -1)]
        )
        return cls.to_dict(doc) if doc else None
    
    @classmethod
    def get_all_by_mahasiswa_ttu(cls, mahasiswa_id: str, ttu_number: str) -> List[dict]:
        """Get ALL submissions (history) for mahasiswa & TTU, sorted by upload date desc"""
        docs = cls.collection().find(
            {"mahasiswa_id": mahasiswa_id, "ttu_number": ttu_number},
            {"file_data": 0}
        ).sort("uploaded_at", -1)
        return cls.to_list(docs)
    
    @classmethod
    def get_by_id(cls, submission_id: str, include_file: bool = False) -> Optional[dict]:
        """Get submission by ID"""
        try:
            projection = None if include_file else {"file_data": 0}
            doc = cls.collection().find_one({"_id": ObjectId(submission_id)}, projection)
            return cls.to_dict(doc) if doc else None
        except:
            return None

    @classmethod
    def get_file_data(cls, submission_id: str) -> Optional[dict]:
        """Get file data for download"""
        try:
            doc = cls.collection().find_one(
                {"_id": ObjectId(submission_id)},
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
    def get_by_mahasiswa(cls, mahasiswa_id: str) -> List[dict]:
        """Get all submissions by mahasiswa (without file_data)"""
        docs = cls.collection().find({"mahasiswa_id": mahasiswa_id}, {"file_data": 0})
        return cls.to_list(docs)
    
    @classmethod
    def add_comment(cls, submission_id: str, dosen_id: str, dosen_nama: str, 
                   comment_text: str) -> bool:
        """Tambah comment"""
        comment = {
            "dosen_id": dosen_id,
            "dosen_nama": dosen_nama,
            "text": comment_text,
            "created_at": datetime.utcnow(),
        }
        
        result = cls.collection().update_one(
            {"_id": ObjectId(submission_id)},
            {"$push": {"comments": comment}}
        )
        return result.modified_count > 0
    
    @classmethod
    def mark_reviewed(cls, submission_id: str, score: float) -> bool:
        """Mark as reviewed"""
        submission = cls.get_by_id(submission_id)
        result = cls.collection().update_one(
            {"_id": ObjectId(submission_id)},
            {
                "$set": {
                    "status": "reviewed",
                    "score": score,
                    "reviewed_at": datetime.utcnow(),
                }
            }
        )
        if result.modified_count > 0 and submission:
            cls.mahasiswa_collection().update_one(
                {"_id": ObjectId(submission["mahasiswa_id"])},
                {
                    "$set": {
                        f"ttu_status.{submission['ttu_number']}.status": "reviewed",
                        f"ttu_status.{submission['ttu_number']}.reviewed_at": datetime.utcnow(),
                    }
                }
            )
        return result.modified_count > 0
    
    @classmethod
    def mark_rejected(cls, submission_id: str, reason: str, dosen_id: str, dosen_nama: str) -> bool:
        """Mark submission as rejected and add rejection comment"""
        submission = cls.get_by_id(submission_id)
        if not submission:
            return False
        
        # Add rejection comment
        comment = {
            "dosen_id": dosen_id,
            "dosen_nama": dosen_nama,
            "text": f"[DITOLAK] {reason}",
            "created_at": datetime.utcnow(),
        }
        
        result = cls.collection().update_one(
            {"_id": ObjectId(submission_id)},
            {
                "$set": {
                    "status": "rejected",
                    "rejected_at": datetime.utcnow(),
                    "rejection_reason": reason,
                },
                "$push": {"comments": comment}
            }
        )
        
        # Set TTU status back to "needs_revision" so mahasiswa can reupload
        if result.modified_count > 0:
            cls.mahasiswa_collection().update_one(
                {"_id": ObjectId(submission["mahasiswa_id"])},
                {
                    "$set": {
                        f"ttu_status.{submission['ttu_number']}.status": "needs_revision",
                        f"ttu_status.{submission['ttu_number']}.rejected_at": datetime.utcnow(),
                    }
                }
            )
        
        return result.modified_count > 0
    
    @classmethod
    def cancel_by_mahasiswa(cls, mahasiswa_id: str, ttu_number: str) -> bool:
        """Cancel latest submitted submission by mahasiswa"""
        # Find latest submitted submission
        submission = cls.collection().find_one(
            {
                "mahasiswa_id": mahasiswa_id,
                "ttu_number": ttu_number,
                "status": "submitted"
            },
            sort=[("uploaded_at", -1)]
        )
        
        if not submission:
            return False
        
        # Delete the submission
        result = cls.collection().delete_one({"_id": submission["_id"]})
        
        # Reset TTU status back to "open"
        if result.deleted_count > 0:
            cls.mahasiswa_collection().update_one(
                {"_id": ObjectId(mahasiswa_id)},
                {
                    "$set": {
                        f"ttu_status.{ttu_number}.status": "open",
                    },
                    "$unset": {
                        f"ttu_status.{ttu_number}.submitted_at": ""
                    }
                }
            )
        
        return result.deleted_count > 0
