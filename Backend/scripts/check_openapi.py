from fastapi.testclient import TestClient
from app.main import app
import json

client = TestClient(app)
openapi = client.get('/openapi.json').json()
schema = openapi['paths']['/resume/analyze']['post']['responses']['200']['content']['application/json']['schema']
print(json.dumps(schema, indent=2))
