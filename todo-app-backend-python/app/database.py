import os
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=env_path)


MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = "todo_app"

# Initialize the MongoDB client with Server API version and certifi certificate
client = AsyncIOMotorClient(
    MONGODB_URI,
    server_api=ServerApi('1'),
    tlsCAFile=certifi.where()
)
db = client[DATABASE_NAME]

# Collections
todos_collection = db["todos"]
tasks_collection = db["tasks"]

async def ping_server():
    """Test connection to the MongoDB server."""
    try:
        await client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")

# Run the ping test when the script is executed
if __name__ == "__main__":
    asyncio.run(ping_server())
    
    
    
# https://www.mongodb.com/docs/drivers/motor/    
    
