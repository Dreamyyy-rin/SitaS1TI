"""
Input sanitization utilities
"""
import re
from html import escape


class Sanitizer:
    """XSS & injection protection"""
    
    DANGEROUS_PATTERNS = [
        r'<script[^>]*>.*?</script>',
        r'javascript:',
        r'on\w+\s*=',
        r'<iframe[^>]*>.*?</iframe>',
        r'<object[^>]*>.*?</object>',
    ]
    
    @staticmethod
    def sanitize_string(input_str: str, allow_html: bool = False) -> str:
        """Sanitize string input"""
        if not isinstance(input_str, str):
            return str(input_str)
        
        for pattern in Sanitizer.DANGEROUS_PATTERNS:
            input_str = re.sub(pattern, '', input_str, flags=re.IGNORECASE | re.DOTALL)
        
        if not allow_html:
            input_str = escape(input_str)
        
        return input_str.strip()
    
    @staticmethod
    def sanitize_dict(data: dict, allow_html: bool = False) -> dict:
        """Sanitize all strings in dict, strip MongoDB operators ($-prefixed keys)"""
        sanitized = {}
        for key, value in data.items():
            # Proteksi NoSQL injection: hapus key yang dimulai dengan $ (operator MongoDB)
            if isinstance(key, str) and key.startswith('$'):
                continue
            if isinstance(value, str):
                sanitized[key] = Sanitizer.sanitize_string(value, allow_html)
            elif isinstance(value, dict):
                sanitized[key] = Sanitizer.sanitize_dict(value, allow_html)
            elif isinstance(value, list):
                sanitized[key] = [
                    Sanitizer.sanitize_string(item, allow_html) if isinstance(item, str)
                    else Sanitizer.sanitize_dict(item, allow_html) if isinstance(item, dict)
                    else item
                    for item in value
                ]
            else:
                sanitized[key] = value
        return sanitized
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename"""
        filename = re.sub(r'[/\\:]', '_', filename)
        filename = re.sub(r'[^\w\s\.\-]', '', filename)
        filename = filename.lstrip('.')
        return filename

    @staticmethod
    def sanitize_query_value(value):
        """
        Proteksi NoSQL injection.
        Memastikan value yang digunakan di MongoDB query adalah tipe primitif (str, int, float, bool),
        bukan dict/operator seperti {"$gt": ""} yang bisa bypass filter.
        """
        if isinstance(value, dict):
            # Tolak semua dict value dalam query — bisa berisi operator NoSQL
            return ""
        if isinstance(value, list):
            return [Sanitizer.sanitize_query_value(v) for v in value]
        if isinstance(value, (str, int, float, bool)) or value is None:
            return value
        return str(value)
