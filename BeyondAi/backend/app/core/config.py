from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "BeyondAi"
    
    # Database Settings
    DATABASE_URL: str = "sqlite:///./securescan.db"
    
    # Security Settings
    SECRET_KEY: str = "dev_secret_key_change_me_to_something_secure_and_long_1234567890"
    JWT_SECRET: str = "dev_jwt_secret_key_change_me_to_something_secure_and_long_1234567890"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ALGORITHM: str = "HS256"
    
    # Scanning Settings
    NMAP_PATH: str = "nmap"
    ZAP_URL: str = "http://localhost:8080"
    ZAP_API_KEY: Optional[str] = None
    SCAN_TIMEOUT: int = 600
    MAX_CONCURRENT_SCANS: int = 3
    ALLOW_PRIVATE_TARGETS: bool = True
    
    # Custom configurations for NMAP
    NMAP_ARGUMENTS: str = "-sV --version-light"

    # Settings configurations (Pydantic V2)
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
