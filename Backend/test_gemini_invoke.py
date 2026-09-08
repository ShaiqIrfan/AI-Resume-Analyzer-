import os
from dotenv import load_dotenv
load_dotenv()
from app.services.analysis_service import analyze_resume_text

text = (
    "Experienced software engineer with 5 years in Python, FastAPI, ML, and resume parsing experience."
)

try:
    resp = analyze_resume_text(text)
    print('---ANALYSIS_SUCCESS---')
    if isinstance(resp, str):
        print(resp[:4000])
    else:
        print(repr(resp))
except Exception as e:
    import traceback
    print('---ANALYSIS_EXCEPTION---')
    traceback.print_exc()
