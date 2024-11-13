from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.routers import task_routers, todo_routers

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  
    allow_credentials=True,
    allow_methods=["*"],  # ['*'] to allow all standard methods
    allow_headers=["*"],  # ['*'] to allow all headers
)

# https://fastapi.tiangolo.com/tutorial/cors/#use-corsmiddleware


app.include_router(todo_routers.router, prefix="/api/todos", tags=["Todos"])
app.include_router(task_routers.router, prefix="/api/tasks", tags=["Tasks"])

# https://fastapi.tiangolo.com/reference/apirouter/?h=include_router#fastapi.APIRouter.include_router

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
