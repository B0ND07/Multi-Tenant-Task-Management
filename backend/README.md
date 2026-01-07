# Multi-Tenant Task Management Backend

FastAPI backend for a multi-tenant task management SaaS platform.

## Setup

1. **Activate Virtual Environment:**
   ```bash
   # Windows PowerShell
   .\activate.ps1

   # Or Windows Command Prompt
   activate.bat
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment:**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your actual database credentials and secrets

4. **Initialize Database:**
   ```bash
   python init_db.py
   ```

5. **Run the Application:**
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at: http://127.0.0.1:8001

## Database Models

The application uses the following multi-tenant database models:

- **Tenant**: Represents organizations/companies
- **User**: Users belonging to tenants with role-based access
- **Project**: Projects within tenants containing tasks
- **Task**: Individual tasks with status, priority, and assignments

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://127.0.0.1:8001/docs
- **ReDoc**: http://127.0.0.1:8001/redoc
