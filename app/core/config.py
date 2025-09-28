from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DB_SERVER: str = "localhost"
    DB_PORT: int = 1433
    DB_NAME: str = "HealthBeatDB"
    DB_USER: str = "sa"
    DB_PASSWORD: str = "YourStrong!Pass"
    DB_DRIVER: str = "ODBC Driver 17 for SQL Server"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # CORS
    FRONTEND_HOST: str = "http://localhost:3000"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    # Environment
    ENVIRONMENT: str = "development"
    
    @property
    def database_url(self) -> str:
        if self.ENVIRONMENT == "test":
            return "sqlite:///./test.db"
        return f"mssql+pyodbc://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_SERVER}:{self.DB_PORT}/{self.DB_NAME}?driver={self.DB_DRIVER.replace(' ', '+')}"
    
    class Config:
        env_file = ".env"

settings = Settings()