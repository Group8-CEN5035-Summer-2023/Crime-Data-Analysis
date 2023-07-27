from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi.openapi.utils import get_openapi
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import HTMLResponse, JSONResponse

from app.router import router 

app = FastAPI()

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from this origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


# SWAGGER INTEGRATION

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Crime Data Analysis - Swagger UI",
        version="1.0.0",
        description="A web application to view and analyse crime data.",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Serves the Swagger UI HTML page
@app.get("/docs/", response_class=HTMLResponse)
async def get_documentation():
    return get_swagger_ui_html(openapi_url="/openapi.json", title="Swagger UI")

# Route to serve the OpenAPI JSON specification
@app.get("/openapi.json")
async def get_openapi_endpoint():
    return JSONResponse(content=app.openapi())
