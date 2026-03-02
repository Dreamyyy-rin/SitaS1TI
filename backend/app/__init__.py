from flask import Flask, jsonify, request as flask_request
from flask_cors import CORS
from .config import settings
from .db import init_mongo, get_db
from .routes import register_blueprints


def create_app() -> Flask:
    """App factory - create dan configure Flask app"""
    
    app = Flask(__name__)
    app.config["SECRET_KEY"] = settings.secret_key
    
    cors_origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]

    # Enable CORS - r"/api/.*" is a proper regex matching all /api/ routes
    CORS(
        app,
        resources={r"/api/.*": {"origins": cors_origins}},
        supports_credentials=False,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    )

    # Fallback: ensure CORS headers on ALL responses (including error responses)
    @app.after_request
    def add_cors_headers(response):
        origin = response.headers.get("Access-Control-Allow-Origin")
        if not origin:
            req_origin = flask_request.headers.get("Origin", "")
            if req_origin in cors_origins:
                response.headers["Access-Control-Allow-Origin"] = req_origin
                response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        return response

    # Initialize MongoDB
    init_mongo(settings.mongo_uri)

    # Register all blueprints
    register_blueprints(app)

    # Health check endpoint
    @app.get("/health")
    def health_check():
        try:
            db = get_db()
            return jsonify({"status": "ok", "db": db.name})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500

    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Endpoint tidak ditemukan"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app


if __name__ == "__main__":
    create_app().run(host="0.0.0.0", port=8000, debug=True)
