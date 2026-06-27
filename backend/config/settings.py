from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "MindSync AI Decision Support API"
    DEBUG: bool = True
    API_PREFIX: str = "/api"

    ALLOWED_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://mindsync-ai-digital-wellnessfrontend.onrender.com",
    ]

    class Config:
        env_file = ".env"

settings = Settings()
