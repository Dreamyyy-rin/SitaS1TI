"""
Seed data for SITA backend.
"""
import os
import sys
from pathlib import Path

# Add parent directory to path so we can import app module
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.config import settings
from app.db import init_mongo
from app.auth.service import AuthService
from app.models import User, Mahasiswa
from app.models.user import UserRole


def seed():
    init_mongo(settings.mongo_uri)

    def create_user_if_missing(email: str, password: str, nama: str, role: UserRole,
                               nidn: str | None = None, prodi: str | None = None):
        if not User.find_by_email(email):
            password_hash = AuthService.hash_password(password)
            User.create(
                email=email,
                password_hash=password_hash,
                nama=nama,
                role=role,
                nidn=nidn,
                prodi=prodi,
            )
            print(f"Created {role}: {email}")
        else:
            print(f"{role} already exists: {email}")

    def create_mahasiswa_if_missing(nim: str, nama: str, email: str, password: str,
                                    prodi: str, angkatan: int):
        if not Mahasiswa.find_by_email(email):
            password_hash = AuthService.hash_password(password)
            Mahasiswa.create(
                nim=nim,
                nama=nama,
                email=email,
                password_hash=password_hash,
                prodi=prodi,
                angkatan=angkatan,
            )
            print(f"Created mahasiswa: {email}")
        else:
            print(f"Mahasiswa already exists: {email}")

    # Superadmin
    create_user_if_missing(
        email=os.getenv("SEED_SUPERADMIN_EMAIL", "admin@sita.local"),
        password=os.getenv("SEED_SUPERADMIN_PASSWORD", "Admin123!"),
        nama=os.getenv("SEED_SUPERADMIN_NAME", "Super Admin"),
        role=UserRole.SUPERADMIN,
    )

    # Kaprodi
    create_user_if_missing(
        email=os.getenv("SEED_KAPRODI_EMAIL", "kaprodi@sita.local"),
        password=os.getenv("SEED_KAPRODI_PASSWORD", "Kaprodi123!"),
        nama=os.getenv("SEED_KAPRODI_NAME", "Kaprodi TI"),
        role=UserRole.KAPRODI,
        nidn=os.getenv("SEED_KAPRODI_NIDN", "19870001"),
        prodi=os.getenv("SEED_KAPRODI_PRODI", "Teknik Informatika"),
    )

    # Dosen
    create_user_if_missing(
        email=os.getenv("SEED_DOSEN_EMAIL", "dosen@sita.local"),
        password=os.getenv("SEED_DOSEN_PASSWORD", "Dosen123!"),
        nama=os.getenv("SEED_DOSEN_NAME", "Dosen Pembimbing"),
        role=UserRole.DOSEN,
        nidn=os.getenv("SEED_DOSEN_NIDN", "19870002"),
    )

    # Mahasiswa (bisa ditambah via env)
    create_mahasiswa_if_missing(
        nim=os.getenv("SEED_MAHASISWA_NIM", "672022001"),
        nama=os.getenv("SEED_MAHASISWA_NAME", "Budi Santoso"),
        email=os.getenv("SEED_MAHASISWA_EMAIL", "mahasiswa@sita.local"),
        password=os.getenv("SEED_MAHASISWA_PASSWORD", "Mahasiswa123!"),
        prodi=os.getenv("SEED_MAHASISWA_PRODI", "Teknik Informatika"),
        angkatan=int(os.getenv("SEED_MAHASISWA_ANGKATAN", "2022")),
    )

    create_mahasiswa_if_missing(
        nim=os.getenv("SEED_MAHASISWA2_NIM", "672022002"),
        nama=os.getenv("SEED_MAHASISWA2_NAME", "Sari Wulandari"),
        email=os.getenv("SEED_MAHASISWA2_EMAIL", "mahasiswa2@sita.local"),
        password=os.getenv("SEED_MAHASISWA2_PASSWORD", "Mahasiswa123!"),
        prodi=os.getenv("SEED_MAHASISWA2_PRODI", "Teknik Informatika"),
        angkatan=int(os.getenv("SEED_MAHASISWA2_ANGKATAN", "2022")),
    )


if __name__ == "__main__":
    seed()
