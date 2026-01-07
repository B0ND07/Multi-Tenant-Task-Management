from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database settings
    database_url: str

    # JWT settings
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Application settings
    app_name: str = "Multi-Tenant Task Management"
    debug: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()