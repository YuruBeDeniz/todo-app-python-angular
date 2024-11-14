from typing import Optional
from pydantic import BaseModel, Field

class Task(BaseModel):
    title: str
    completed: bool = False

class Todo(BaseModel):
    title: str
    completed: bool = False

class TodoResponse(Todo):
    id: Optional[str] 
    
class TaskResponse(Task):
    id: str
    


# Pydantic models handle request and response data.    