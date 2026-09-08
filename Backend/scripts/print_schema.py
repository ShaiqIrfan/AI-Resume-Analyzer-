from fastapi.testclient import TestClient
from app.main import app
import json

client = TestClient(app)
openapi = client.get('/openapi.json').json()
print(json.dumps(openapi['components']['schemas'].get('ResumeAnalyzeResponse', {}), indent=2))
