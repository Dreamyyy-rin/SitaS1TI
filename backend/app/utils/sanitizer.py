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
        """Sanitize all strings in dict"""
        sanitized = {}
        for key, value in data.items():
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
