from flask import Flask, jsonify, request
from flask_cors import CORS
from .config import settings
from .db import init_mongo, get_db
from .routes import register_blueprints


def create_app() -> Flask:
    """App factory - create dan configure Flask app"""
    
    app = Flask(__name__)
    app.config["SECRET_KEY"] = settings.secret_key
    
    # Enable CORS with proper configuration
    CORS(app, 
         resources={r"/*": {"origins": "*"}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])

    # Initialize MongoDB
    init_mongo(settings.mongo_uri)

    # Register all blueprints
    register_blueprints(app)

    # Global OPTIONS handler for CORS preflight
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = jsonify({"status": "ok"})
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
            response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS,PATCH")
            return response, 200

    # Health check endpoint
    @app.get("/health")
    def health_check():
        try:
            db = get_db()
            return {"status": "ok", "db": db.name}
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500

    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        return {"error": "Endpoint tidak ditemukan"}, 404

    @app.errorhandler(500)
    def internal_error(e):
        return {"error": "Internal server error"}, 500

    return app


if __name__ == "__main__":
    create_app().run(host="0.0.0.0", port=8000, debug=True)
