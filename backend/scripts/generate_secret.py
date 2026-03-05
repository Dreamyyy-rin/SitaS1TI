"""
Helper script untuk generate SECRET_KEY untuk production
Run: python scripts/generate_secret.py
"""

import secrets

if __name__ == "__main__":
    secret_key = secrets.token_urlsafe(32)
    
    print("=" * 60)
    print("SECRET KEY GENERATOR")
    print("=" * 60)
    print("\nYour new SECRET_KEY:")
    print(f"\n{secret_key}\n")
    print("=" * 60)
    print("\nAdd this to your Render environment variables:")
    print(f"SECRET_KEY = {secret_key}")
    print("=" * 60)
    print("\n⚠️  IMPORTANT: Keep this secret! Don't commit to GitHub!")
    print("\n")
