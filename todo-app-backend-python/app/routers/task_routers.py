from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import tasks_collection
from app.models import Task, TaskResponse

router = APIRouter()

def task_helper(task) -> dict:
    return {
        "id": str(task["_id"]),
        "title": task["title"],
        "completed": task["completed"]
    }

@router.post("/", response_model=TaskResponse)
async def create(task: Task):
    new_task = await tasks_collection.insert_one(task.model_dump())
    created_task = await tasks_collection.find_one({"_id": new_task.inserted_id})
    return task_helper(created_task)

@router.get("/", response_model=list[TaskResponse])
async def read():
    tasks = []
    async for task in tasks_collection.find():
        tasks.append(task_helper(task))
    return tasks

@router.put("/{id}", response_model=TaskResponse)
async def update(id: str, task: Task):
    result = await tasks_collection.update_one(
        {"_id": ObjectId(id)}, {"$set": task.model_dump()}
    )
    if result.modified_count == 1:
        updated_task = await tasks_collection.find_one({"_id": ObjectId(id)})
        return task_helper(updated_task)
    raise HTTPException(status_code=404, detail="Task not found")

@router.delete("/{id}")
async def delete(id: str):
    result = await tasks_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Task not found")
