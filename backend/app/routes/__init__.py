"""
Routes package - blueprint registration
"""
from .auth import auth_bp
from .mahasiswa import mahasiswa_bp
from .dosen import dosen_bp
from .kaprodi import kaprodi_bp
from .superadmin import superadmin_bp


def register_blueprints(app):
    """Register semua blueprint ke app"""
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(mahasiswa_bp, url_prefix="/api")
    app.register_blueprint(dosen_bp, url_prefix="/api")
    app.register_blueprint(kaprodi_bp, url_prefix="/api")
    app.register_blueprint(superadmin_bp, url_prefix="/api")


__all__ = [
    "auth_bp",
    "mahasiswa_bp",
    "dosen_bp",
    "kaprodi_bp",
    "superadmin_bp",
    "register_blueprints",
]
