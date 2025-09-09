from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Status": "API do SisFinance está no ar!"}