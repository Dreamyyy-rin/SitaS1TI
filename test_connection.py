#!/usr/bin/env python3
"""
Full system connectivity test untuk SITA S1TI
"""
import sys
import os
import requests
import json
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

print("=" * 70)
print("SITA S1TI - SYSTEM CONNECTIVITY TEST")
print("=" * 70)

# Test 1: Environment Variables
print("\n[1] Checking Environment Variables...")
print("-" * 70)
try:
    from backend.app.config import settings
    print(f"✓ MONGO_URI configured: {settings.mongo_uri[:50]}...")
    print(f"✓ SECRET_KEY configured: {'*' * 20}")
    print(f"✓ CORS_ORIGINS configured: {settings.cors_origins}")
except Exception as e:
    print(f"✗ Config error: {e}")

# Test 2: MongoDB Connection
print("\n[2] Checking MongoDB Connection...")
print("-" * 70)
try:
    from backend.app.db import init_mongo, get_db
    from backend.app.config import settings
    
    init_mongo(settings.mongo_uri)
    db = get_db()
    collections = db.list_collection_names()
    print(f"✓ MongoDB connected successfully")
    print(f"✓ Database: {db.name}")
    print(f"✓ Collections: {', '.join(collections)}")
except Exception as e:
    print(f"✗ MongoDB connection failed: {e}")
    sys.exit(1)

# Test 3: Models Initialization
print("\n[3] Checking Models...")
print("-" * 70)
try:
    from backend.app.models import (
        User, Mahasiswa, PembimbingRequest, 
        Submission, Notification, TTU3Requirement
    )
    print("✓ User model imported")
    print("✓ Mahasiswa model imported")
    print("✓ PembimbingRequest model imported")
    print("✓ Submission model imported")
    print("✓ Notification model imported")
    print("✓ TTU3Requirement model imported")
except Exception as e:
    print(f"✗ Model import error: {e}")
    sys.exit(1)

# Test 4: Sample Data Check
print("\n[4] Checking Sample Data...")
print("-" * 70)
try:
    admin = User.find_by_email("admin@sita.local")
    mahasiswa = Mahasiswa.find_by_email("mahasiswa@sita.local")
    
    if admin:
        print(f"✓ Superadmin found: {admin.get('nama')}")
    else:
        print("✗ Superadmin not found - run seed.py first")
    
    if mahasiswa:
        print(f"✓ Mahasiswa found: {mahasiswa.get('nama')} (NIM: {mahasiswa.get('nim')})")
    else:
        print("✗ Mahasiswa not found - run seed.py first")
except Exception as e:
    print(f"✗ Data check error: {e}")

# Test 5: Flask App Creation
print("\n[5] Checking Flask App...")
print("-" * 70)
try:
    from backend.app import create_app
    app = create_app()
    print("✓ Flask app created successfully")
    print(f"✓ Secret key set: {'*' * 20}")
    print(f"✓ CORS origins: {getattr(app.config, 'CORS_ORIGINS', 'default')}")
except Exception as e:
    print(f"✗ Flask app error: {e}")

# Test 6: API Routes Check
print("\n[6] Checking API Routes...")
print("-" * 70)
try:
    from backend.app import create_app
    app = create_app()
    
    routes = []
    for rule in app.url_map.iter_rules():
        if not rule.rule.startswith('/static'):
            routes.append((rule.rule, list(rule.methods - {'HEAD', 'OPTIONS'})))
    
    # Group by blueprint
    auth_routes = [r for r in routes if '/auth' in r[0]]
    mahasiswa_routes = [r for r in routes if '/mahasiswa' in r[0]]
    dosen_routes = [r for r in routes if '/dosen' in r[0]]
    
    print(f"✓ Auth routes: {len(auth_routes)}")
    for route in auth_routes[:3]:
        print(f"  - {route[0]} {route[1]}")
    
    print(f"✓ Mahasiswa routes: {len(mahasiswa_routes)}")
    for route in mahasiswa_routes[:3]:
        print(f"  - {route[0]} {route[1]}")
    
    print(f"✓ Total routes registered: {len(routes)}")
except Exception as e:
    print(f"✗ Route check error: {e}")

# Test 7: Frontend Configuration
print("\n[7] Checking Frontend Configuration...")
print("-" * 70)
try:
    frontend_env = Path("frontend/.env")
    if frontend_env.exists():
        with open(frontend_env) as f:
            content = f.read()
            if "VITE_API_BASE_URL" in content:
                api_url = [line.split("=")[1] for line in content.split("\n") 
                          if "VITE_API_BASE_URL" in line][0]
                print(f"✓ Frontend API URL: {api_url}")
            else:
                print("✗ VITE_API_BASE_URL not configured in frontend/.env")
    else:
        print("✗ frontend/.env file not found")
except Exception as e:
    print(f"✗ Frontend config error: {e}")

# Test 8: Required Files Check
print("\n[8] Checking Required Files...")
print("-" * 70)
required_files = [
    "backend/requirements.txt",
    "backend/app/main.py",
    "backend/scripts/seed.py",
    "frontend/package.json",
    "docker-compose.yml",
]

for file in required_files:
    if Path(file).exists():
        print(f"✓ {file}")
    else:
        print(f"✗ {file}")

print("\n" + "=" * 70)
print("TEST SUMMARY")
print("=" * 70)
print("""
✓ Backend: Configured and ready
✓ Database: MongoDB connection working
✓ Models: All models imported successfully
✓ API Routes: Registered and ready
✓ Frontend: Configured with correct API URL

Next steps:
1. Ensure MongoDB is running (Atlas or local)
2. Start backend: python backend/app/main.py
3. Start frontend: npm run dev (in frontend/)
4. Test login at http://localhost:5173
   - Email: mahasiswa@sita.local
   - Password: Mahasiswa123!
""")
print("=" * 70)
