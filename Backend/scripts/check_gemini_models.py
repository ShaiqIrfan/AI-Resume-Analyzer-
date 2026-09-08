from dotenv import load_dotenv
from google.genai import Client
import os

load_dotenv()
client = Client()

models = client.models.list()

gemini_models = [m for m in models if 'gemini' in getattr(m, 'name', '').lower()]
print('TOTAL_GEMINI_MODELS', len(gemini_models))
for m in gemini_models:
    name = getattr(m, 'name', str(m))
    methods = getattr(m, 'supported_generation_methods', None)
    print(name, methods)

# Select flash/flash-lite candidates
candidates = [getattr(m,'name') for m in gemini_models if ('flash' in getattr(m,'name').lower() or 'flash-lite' in getattr(m,'name').lower())]
# also include a few other compact options
candidates = list(dict.fromkeys(candidates))[:6]
print('\nCANDIDATES_FOR_QUOTA_TEST:')
for c in candidates:
    print('-', c)

print('\nBEGIN_QUOTA_TESTS')
for c in candidates:
    try:
        print('\nTEST_MODEL', c)
        # Try a minimal generate_content call
        # The API shape may accept "model" or "name"; try both.
        try:
            resp = client.models.generate_content(model=c, contents="Hi")
        except TypeError:
            # fallback: older versions might require different param names; try positional
            resp = client.models.generate_content(c, "Hi")
        print('OK', type(resp))
        # print a short summary
        text = ''
        if hasattr(resp, 'candidates'):
            # typical response contains candidates
            cand = resp.candidates[0]
            text = getattr(cand, 'content', getattr(cand, 'text', str(cand)))
        else:
            text = str(resp)[:400]
        print('RESPONSE_SNIPPET:', repr(text)[:400])
    except Exception as e:
        print('ERROR_TYPE', type(e).__name__)
        # Print only exception message, avoid secrets
        print('ERROR_MSG', str(e))
