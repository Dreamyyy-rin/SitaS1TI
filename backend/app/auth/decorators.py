"""
Authentication decorators
"""
from functools import wraps
from flask import request, g
from .service import AuthService


def token_required(f):
    """Decorator untuk JWT validation"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return {"error": "Format header tidak valid"}, 401
        
        if not token:
            return {"error": "Token diperlukan"}, 401
        
        payload = AuthService.verify_token(token)
        if not payload:
            return {"error": "Token tidak valid atau sudah expired"}, 401
        
        g.current_user = payload
        return f(*args, **kwargs)
    
    return decorated


def role_required(*allowed_roles):
    """Decorator untuk role check"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(g, 'current_user'):
                return {"error": "Authenticate dulu"}, 401
            
            user_role = g.current_user.get("role")
            if user_role not in allowed_roles:
                return {"error": f"Akses ditolak. Role harus: {', '.join(allowed_roles)}"}, 403
            
            return f(*args, **kwargs)
        
        return decorated
    
    return decorator
