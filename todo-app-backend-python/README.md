### to start the app
uvicorn app.main:app --reload

### run a file
python app/database.py

### create a virtual env
python3 -m venv venv

### activate a virtual env
source venv/bin/activate

### install a package inside your venv
pip install fastapi uvicorn motor pydantic python-dotenv certifi

### deactivate
deactivate

### To list your project dependencies
pip install -r requirements.txt
pip freeze > requirements.txt



### how-to-build-an-api-in-python
FASTAPI & uvicorn
https://blog.postman.com/how-to-build-an-api-in-python/

### use middleware
https://fastapi.tiangolo.com/tutorial/cors/#use-corsmiddleware

### 
https://fastapi.tiangolo.com/reference/apirouter/?h=include_router#fastapi.APIRouter.include_router
