from typing import Optional
from pymongo import MongoClient

_mongo_client: Optional[MongoClient] = None

def init_mongo(uri: str) -> MongoClient:
    global _mongo_client
    if _mongo_client is None:
        _mongo_client = MongoClient(uri)
    return _mongo_client

def get_db(db_name: str = None):
    if _mongo_client is None:
        raise RuntimeError("Mongo client is not initialized. Call init_mongo first.")
    # Use provided db_name or default to "sita"
    return _mongo_client[db_name or "sita"]
