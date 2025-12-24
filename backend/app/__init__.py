from flask import Flask
from .config import settings
from .db import init_mongo, get_db
from .routes import api_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["SECRET_KEY"] = settings.secret_key

    init_mongo(settings.mongo_uri)

    app.register_blueprint(api_bp, url_prefix="/api")

    @app.get("/health")
    def health_check():
        db = get_db()
        return {"status": "ok", "db": db.name}

    return app


if __name__ == "__main__":
    create_app().run(host="0.0.0.0", port=8000, debug=True)
