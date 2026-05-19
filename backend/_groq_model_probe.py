from dotenv import load_dotenv
import os
import ssl
import certifi
import httpx

load_dotenv()
key = os.getenv('GROQ_API_KEY')
print('key loaded', bool(key))
ssl_context = ssl.create_default_context(cafile=certifi.where())
if hasattr(ssl, 'TLSVersion'):
    ssl_context.minimum_version = ssl.TLSVersion.TLSv1_2
models = [
    os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile'),
    os.getenv('GROQ_FALLBACK_MODEL', 'llama-3.1-8b-instant'),
]
for model in models:
    try:
        with httpx.Client(timeout=httpx.Timeout(60.0, connect=30.0), verify=ssl_context) as client:
            body = {
                'model': model,
                'messages': [
                    {'role': 'system', 'content': 'You are a helpful assistant.'},
                    {'role': 'user', 'content': 'Hello'}
                ],
                'temperature': 0.0,
                'max_tokens': 50,
            }
            resp = client.post('https://api.groq.com/openai/v1/chat/completions', headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}, json=body)
            print(model, resp.status_code, resp.text)
    except Exception as exc:
        print(model, 'ERROR', type(exc).__name__, exc)
