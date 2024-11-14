from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import tasks_collection
from app.models import Task, TaskResponse
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()

# 1. Create a new task
@router.post("/", response_model=TaskResponse)
async def create_task(task: Task):
    try:
        print("TASK: ", task)
        # TASK:  title='new task' completed=False
        new_task = task.model_dump()
        print("NEW TASK: ", new_task)
        # NEW TASK:  {'title': 'new task', 'completed': False}
        result = await tasks_collection.insert_one(new_task)
        print("RESULT FROM MONGODB: ",result)
        new_task['_id'] = str(result.inserted_id)
        return {"id": new_task['_id'], **new_task}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

# MongoDB expects data in the form of a dictionary when inserting documents.
# The task object is a Pydantic model, so converting it to a dictionary makes
# it compatible with MongoDB.


# 2. Get all tasks
@router.get("/", response_model=List[TaskResponse])
async def get_tasks():
    try:
        tasks = []
        async for task in tasks_collection.find():
            task['id'] = str(task.pop('_id'))
            tasks.append(task)
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

# 3. Update a task (using partial updates with dict)
@router.put("/{id}", response_model=TaskResponse)
async def update_task(id: str, updated_fields: dict):
    try: 
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid task ID")

        result = await tasks_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": updated_fields}
        )
        if result.modified_count == 1:
            updated_task = await tasks_collection.find_one({"_id": ObjectId(id)})
            updated_task['id'] = str(updated_task.pop('_id'))
            return updated_task
        raise HTTPException(status_code=404, detail="Task not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

# 4. Get details of a single task
@router.get("/task-details/{id}", response_model=TaskResponse)
async def get_task_details(id: str):
    try: 
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid task ID")
    
        task = await tasks_collection.find_one({"_id": ObjectId(id)})
        if task:
            task['id'] = str(task.pop('_id'))
            return task
        raise HTTPException(status_code=404, detail="Task not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

# 5. Delete a task
@router.delete("/{id}")
async def delete_task(id: str):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid task ID")

        result = await tasks_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 1:
            return {"status": "deleted"}
        raise HTTPException(status_code=404, detail="Task not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")
