import json
import urllib.request

BASE = 'http://127.0.0.1:8000/api'

prompts = [
    'Hello',
    'What about oil?',
    'Tell me about supply chain disruptions',
    'Which sectors are affected by higher interest rates?',
    'Give me a short market prediction for the next quarter',
    'How does a natural disaster impact logistics?',
    'Who benefits from rising commodity prices?',
    'Explain risk factors in one sentence',
    'Compare defensive vs cyclical sectors',
    'What is the outlook for airlines?'
]

for p in prompts:
    try:
        req = urllib.request.Request(f"{BASE}/chat", method='POST', headers={'Content-Type': 'application/json'}, data=json.dumps({'message': p}).encode('utf-8'))
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read().decode('utf-8')
            data = json.loads(body)
            print('PROMPT:', p)
            print('REPLY:', data.get('answer')[:300])
            print('SOURCES:', data.get('sources'))
    except urllib.error.HTTPError as he:
        print('PROMPT:', p)
        print('ERROR HTTP:', he.code, he.read().decode('utf-8'))
    except Exception as e:
        print('PROMPT:', p)
        print('EXCEPTION:', str(e))
    print('-' * 60)
