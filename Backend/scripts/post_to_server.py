import requests
url = 'http://127.0.0.1:8001/resume/analyze'
pdf_bytes = b'%PDF-1.4\n%EOF\n'
files = {'file': ('resume.pdf', pdf_bytes, 'application/pdf')}
resp = requests.post(url, files=files)
print('STATUS', resp.status_code)
print('TEXT', resp.text)
