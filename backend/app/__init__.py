from flask import Flask, jsonify
from flask_cors import CORS
from .config import settings
from .db import init_mongo, get_db
from .routes import register_blueprints


def create_app() -> Flask:
    """App factory - create dan configure Flask app"""
    
    app = Flask(__name__)
    app.config["SECRET_KEY"] = settings.secret_key
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize MongoDB
    init_mongo(settings.mongo_uri)

    # Register all blueprints
    register_blueprints(app)

    # Health check endpoint
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
