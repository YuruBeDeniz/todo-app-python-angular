from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import todos_collection
from app.models import Todo, TodoResponse

router = APIRouter()

def todo_helper(todo) -> dict:
    return {
        "id": str(todo["_id"]),
        "title": todo["title"],
        "completed": todo["completed"]
    }

@router.post("/", response_model=TodoResponse)
async def create_todo(todo: Todo):
    try:
        new_todo = await todos_collection.insert_one(todo.model_dump())
        created_todo = await todos_collection.find_one({"_id": new_todo.inserted_id})
        return todo_helper(created_todo)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

@router.get("/", response_model=list[TodoResponse])
async def read_todos():
    try:
        todos = []
        async for todo in todos_collection.find():
            todos.append(todo_helper(todo))
        return todos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

@router.put("/{id}", response_model=TodoResponse)
async def update_todo(id: str, todo: Todo):
    try:
        result = await todos_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": todo.model_dump()}
        )
        if result.modified_count == 1:
            updated_todo = await todos_collection.find_one({"_id": ObjectId(id)})
            return todo_helper(updated_todo)
        raise HTTPException(status_code=404, detail="Todo not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")




# MongoDB uses ObjectId types for document IDs, which are not JSON serializable by default.
# When you fetch data from MongoDB, the documents include fields like _id that need to be 
# converted to strings or other formats.
