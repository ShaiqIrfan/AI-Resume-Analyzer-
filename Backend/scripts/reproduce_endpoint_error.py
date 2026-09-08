import sys
from pathlib import Path
# Ensure workspace root is on sys.path so `app` package imports correctly.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

pdf_bytes = b"%PDF-1.4\n%EOF\n"  # minimal invalid PDF; extraction returns empty string
files = {"file": ("resume.pdf", pdf_bytes, "application/pdf")}

resp = client.post("/resume/analyze", files=files)
print('STATUS', resp.status_code)
print('JSON', resp.text)

if resp.status_code >= 500:
    # print more info
    print('\nResponse headers:', resp.headers)
