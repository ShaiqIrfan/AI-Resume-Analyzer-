from dotenv import load_dotenv
load_dotenv()
from google.genai import Client
import inspect

c = Client()
print('has models:', hasattr(c, 'models'))
print('models attr type:', type(c.models))
print('members:', [name for name in dir(c.models) if not name.startswith('_')])
print('\nSIG generate_content:')
print(inspect.signature(c.models.generate_content))
