from app.services.analysis_service import analyze_resume_text
from app.schemas.resume import ResumeAnalysis

sample = """Python
FastAPI
LangChain
Computer Vision
Built an AI Resume Analyzer using LangChain and Gemini.
"""

print('Invoking analyze_resume_text...')
res = analyze_resume_text(sample)
print('Type:', type(res))

if not isinstance(res, ResumeAnalysis):
    raise SystemExit('Result is not ResumeAnalysis')

if not isinstance(res.professional_summary, str):
    raise SystemExit('professional_summary not string')

for attr in ('strengths','weaknesses','skills','recommendations'):
    val = getattr(res, attr)
    if not isinstance(val, list):
        raise SystemExit(f'{attr} is not a list')
    if not all(isinstance(x, str) for x in val):
        raise SystemExit(f'Not all items in {attr} are strings')

print('All checks passed')
print(res.model_dump_json(indent=2))
