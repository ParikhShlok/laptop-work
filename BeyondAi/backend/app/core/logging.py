import logging
import sys
import re

# Sensitive pattern detection to redact from logs
SENSITIVE_PATTERNS = [
    re.compile(r'(password|token|cookie|api_key|secret|authorization)\s*[:=]\s*["\']?[a-zA-Z0-9_\-\.\/+=]+["\']?', re.IGNORECASE)
]

class SensitiveDataRedactor(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, str):
            record.msg = self.redact(record.msg)
        elif isinstance(record.args, dict):
            record.args = {k: self.redact(v) if isinstance(v, str) else v for k, v in record.args.items()}
        return True

    def redact(self, text: str) -> str:
        for pattern in SENSITIVE_PATTERNS:
            text = pattern.sub(r'\1=[REDACTED]', text)
        return text

def setup_logging():
    # Setup root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    
    # Remove existing handlers to prevent duplicates
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
        
    # Standard output handler
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)
    
    # Add redaction filter to the handler
    handler.addFilter(SensitiveDataRedactor())
    root_logger.addHandler(handler)

# Specific logger for application
logger = logging.getLogger("beyondai")
logger.setLevel(logging.INFO)
