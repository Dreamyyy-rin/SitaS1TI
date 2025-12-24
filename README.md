# SITA TI Stack

React (Vite) frontend + Flask + MongoDB.

## Struktur
- backend/: Flask API, Mongo driver (pymongo)
- frontend/: React Vite
- docker-compose.yml: Mongo + Mongo Express + API container

## Jalankan lokal (tanpa Docker)
1. Backend
   ```bash
   cd backend
   python -m venv .venv
   .venv\\Scripts\\activate  # Windows
   pip install -r requirements.txt
   cp .env.example .env
   flask --app app.main run
   ```
2. Frontend
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Jalankan dengan Docker Compose
```bash
docker compose up --build
```
- API: http://localhost:8000
- Mongo Express: http://localhost:8081 (admin/password)

## Endpoint contoh
- GET /health
- GET /api/ping
- GET /api/students
- POST /api/students {"nim": "123", "nama": "Budi"}

## Konfigurasi env
- backend/.env : SECRET_KEY, MONGO_URI, FLASK_DEBUG
- frontend/.env : VITE_API_BASE_URL

## Next
- Tambah auth (JWT)
- Skema koleksi: users, students, lecturers, thesis_topics, advisings, schedules
- Validasi payload (pydantic/Marshmallow) dan logger
