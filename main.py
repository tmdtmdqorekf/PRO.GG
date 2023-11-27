import uvicorn
from fastapi import FastAPI


app = FastAPI()

@app.get("/")
async def root() : 
    return {"message" : "메인 경로"}

# 디버깅용 서버
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# uvicorn main:app --reload

# http://127.0.0.1:8000/docs