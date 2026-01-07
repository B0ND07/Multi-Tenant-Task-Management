from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Task, User, Project
from app.schemas.main import TaskCreate, TaskResponse, TaskUpdate
from app.routers.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    skip: int = 0,
    limit: int = 100,
    project_id: int = None,
    status: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all tasks for the current user's tenant"""
    query = db.query(Task).join(Project).filter(
        Project.tenant_id == current_user.tenant_id
    )

    if project_id:
        query = query.filter(Task.project_id == project_id)
    if status:
        query = query.filter(Task.status == status)

    tasks = query.offset(skip).limit(limit).all()
    return tasks

@router.post("/", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new task"""
    # Verify project belongs to user's tenant
    project = db.query(Project).filter(
        Project.id == task.project_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # If assigned_to_id is provided, verify the user belongs to the same tenant
    if task.assigned_to_id:
        assigned_user = db.query(User).filter(
            User.id == task.assigned_to_id,
            User.tenant_id == current_user.tenant_id
        ).first()
        if not assigned_user:
            raise HTTPException(status_code=404, detail="Assigned user not found")

    db_task = Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        due_date=task.due_date,
        project_id=task.project_id,
        assigned_to_id=task.assigned_to_id,
        created_by_id=current_user.id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific task by ID"""
    task = db.query(Task).join(Project).filter(
        Task.id == task_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a task"""
    task = db.query(Task).join(Project).filter(
        Task.id == task_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # If assigned_to_id is being updated, verify the user belongs to the same tenant
    if task_update.assigned_to_id:
        assigned_user = db.query(User).filter(
            User.id == task_update.assigned_to_id,
            User.tenant_id == current_user.tenant_id
        ).first()
        if not assigned_user:
            raise HTTPException(status_code=404, detail="Assigned user not found")

    # Update fields
    for field, value in task_update.dict(exclude_unset=True).items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a task"""
    task = db.query(Task).join(Project).filter(
        Task.id == task_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}