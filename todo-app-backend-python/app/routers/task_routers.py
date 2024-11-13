from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import tasks_collection
from app.models import Task, TaskResponse
from typing import List

router = APIRouter()

def task_helper(task) -> dict:
    return {
        "id": str(task["_id"]), 
        "title": task["title"],
        "completed": task["completed"]
    }


@router.post("/", response_model=TaskResponse)
async def create_task(task: Task):
    new_task = await tasks_collection.insert_one(task.model_dump())
    created_task = await tasks_collection.find_one({"_id": new_task.inserted_id})
    return task_helper(created_task)


@router.get("/", response_model=List[TaskResponse])
async def get_tasks():
    tasks = []
    async for task in tasks_collection.find():
        tasks.append(task_helper(task))
    return tasks


@router.put("/{id}", response_model=TaskResponse)
async def update_task(id: str, task: Task):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid task ID")
    
    result = await tasks_collection.update_one(
        {"_id": ObjectId(id)}, {"$set": task.model_dump()}
    )
    if result.modified_count == 1:
        updated_task = await tasks_collection.find_one({"_id": ObjectId(id)})
        if updated_task:
            return task_helper(updated_task)
    raise HTTPException(status_code=404, detail="Task not found")


@router.get("/task-details/{id}", response_model=TaskResponse)
async def get_task_details(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid task ID")
    
    task = await tasks_collection.find_one({"_id": ObjectId(id)})
    if task:
        return task_helper(task)
    raise HTTPException(status_code=404, detail="Task not found")


@router.delete("/{id}")
async def delete_task(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid task ID")
    
    result = await tasks_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Task not found")
