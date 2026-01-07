# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Green
& ".\venv\Scripts\Activate.ps1"
Write-Host "Virtual environment activated!" -ForegroundColor Green
Write-Host "You can now run your FastAPI app with:" -ForegroundColor Yellow
Write-Host "uvicorn main:app --reload" -ForegroundColor Yellow