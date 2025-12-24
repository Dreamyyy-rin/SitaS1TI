from flask import Blueprint, jsonify, request
from .db import get_db

api_bp = Blueprint("api", __name__)


@api_bp.get("/ping")
def ping():
    return {"message": "pong"}


@api_bp.get("/students")
def list_students():
    db = get_db()
    students = list(db.students.find({}, {"_id": 0}).limit(50))
    return jsonify(students)


@api_bp.post("/students")
def create_student():
    payload = request.get_json(force=True) or {}
    required = ["nim", "nama"]
    missing = [f for f in required if f not in payload]
    if missing:
        return {"error": f"Missing fields: {', '.join(missing)}"}, 400

    db = get_db()
    doc = {
        "nim": payload["nim"],
        "nama": payload["nama"],
        "angkatan": payload.get("angkatan"),
        "prodi": payload.get("prodi", "S1 Teknik Informatika"),
    }
    db.students.insert_one(doc)
    return {"message": "created", "nim": doc["nim"]}, 201
