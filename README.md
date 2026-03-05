# SITA S1 TI - Sistem Informasi Tugas Akhir

React (Vite) frontend + Flask + MongoDB.

## Tech Stack

- **Backend**: Python 3.11, Flask, MongoDB, PyJWT
- **Frontend**: React 18, Vite, TailwindCSS

## Struktur

- `backend/`: Flask API
- `frontend/`: React Vite SPA
- `uploads/`: File uploads

## Jalankan Lokal

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app/main.py
```

Backend: http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Deployment

### Backend → Render

1. Push code ke GitHub
2. Buat Web Service di [Render](https://render.com)
3. Connect GitHub repo
4. Konfigurasi:
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn -w 4 -b 0.0.0.0:$PORT app.main:app`
5. Environment Variables:
   ```
   MONGO_URI = mongodb+srv://...  (dari MongoDB Atlas)
   SECRET_KEY = [generate: python backend/scripts/generate_secret.py]
   CORS_ORIGINS = https://your-app.vercel.app
   ```

### Frontend → Vercel

1. Buat project di [Vercel](https://vercel.com)
2. Import GitHub repo
3. Root Directory: `frontend`
4. Environment Variables:
   ```
   VITE_API_URL = https://your-backend.onrender.com
   ```

## 🔧 Environment Variables

### Backend (.env)

```
MONGO_URI=mongodb://localhost:27017/sita
SECRET_KEY=dev-secret-key
CORS_ORIGINS=http://localhost:5173
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:8000
```

## 👥 User Roles

- Mahasiswa: Upload dokumen, request bimbingan
- Dosen: Review dokumen, approve requests
- Kaprodi: Assign reviewer, manage deadlines
- Superadmin: Manage users

## 🛠️ Utils

### Generate SECRET_KEY

```bash
python backend/scripts/generate_secret.py
```

### Seed Database

```bash
cd backend
python scripts/seed.py
```
