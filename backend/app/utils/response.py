"""
Response formatting utilities
"""
from typing import Any, Tuple, Optional


class ResponseFormatter:
    """Format API responses"""
    
    @staticmethod
    def success(data: Any = None, message: str = "Success", status_code: int = 200) -> Tuple[dict, int]:
        """Format success response"""
        response = {
            "success": True,
            "message": message,
        }
        if data is not None:
            response["data"] = data
        return response, status_code
    
    @staticmethod
    def error(error: str, status_code: int = 400, details: Optional[dict] = None) -> Tuple[dict, int]:
        """Format error response"""
        response = {
            "success": False,
            "error": error,
        }
        if details:
            response["details"] = details
        return response, status_code
    
    @staticmethod
    def paginated(items: list, total: int, page: int = 1, per_page: int = 10) -> dict:
        """Format paginated response"""
        total_pages = (total + per_page - 1) // per_page
        return {
            "success": True,
            "data": items,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "total_pages": total_pages,
            }
        }
