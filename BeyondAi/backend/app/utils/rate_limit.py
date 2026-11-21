import time
from collections import defaultdict
from fastapi import Request, HTTPException, status
from typing import Dict, List

class RateLimiter:
    def __init__(self, limit: int, window_seconds: int):
        """
        limit: Max requests allowed in the window.
        window_seconds: Window duration in seconds.
        """
        self.limit = limit
        self.window = window_seconds
        # In-memory store: key -> list of timestamps
        self.history: Dict[str, List[float]] = defaultdict(list)

    def __call__(self, request: Request):
        # Determine rate limiting key
        # If client host IP exists, use it. Otherwise default to 'unknown'
        ip = request.client.host if request.client else "unknown"
        key = f"ip:{ip}"
        
        # If Authorization header exists, use it as rate limit key to prevent bypass by IP rotation
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            key = f"auth:{auth_header}"

        now = time.time()
        # Clean up timestamps older than the window
        self.history[key] = [t for t in self.history[key] if now - t < self.window]

        if len(self.history[key]) >= self.limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later."
            )

        self.history[key].append(now)
