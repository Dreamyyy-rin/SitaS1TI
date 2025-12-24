import os
from dataclasses import dataclass
from dotenv import load_dotenv

# Load .env into environment for local dev
load_dotenv()

@dataclass
class Settings:
    mongo_uri: str = os.getenv("MONGO_URI", "mongodb://admin:password@localhost:27017/sita?authSource=admin")
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret-change-me")

def get_settings() -> Settings:
    return Settings()

settings = get_settings()
