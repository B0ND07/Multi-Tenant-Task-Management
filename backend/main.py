from fastapi import FastAPI
from app.routers import auth, projects, tasks

app = FastAPI(
    title="Multi-Tenant Task Management API",
    description="A SaaS platform for task management with multi-tenancy support",
    version="1.0.0"
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])

@app.get("/")
async def root():
    return {"message": "Welcome to Multi-Tenant Task Management API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}