from pydantic import BaseModel

class Task(BaseModel):
    title: str
    completed: bool = False

class Todo(BaseModel):
    title: str
    completed: bool = False

class TodoResponse(Todo):
    id: str
    
class TaskResponse(Task):
    id: str