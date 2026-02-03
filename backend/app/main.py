import sys
import os

# Tambahkan parent directory ke Python path agar bisa import app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app

app = create_app()

if __name__ == "__main__":
    print("=" * 60)
    print("SITA S1 TI Backend Server")
    print("=" * 60)
    print(f"Server: http://localhost:8000")
    print(f"Health: http://localhost:8000/health")
    print("=" * 60)
    app.run(host="0.0.0.0", port=8000, debug=True)
