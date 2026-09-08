import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.schemas.resume import ResumeAnalysis

# Valid instance
valid = ResumeAnalysis(
    professional_summary="AI/ML student with experience in machine learning and backend development.",
    strengths=["Strong Python skills", "Hands-on AI projects"],
    weaknesses=["Limited full-time industry experience"],
    skills=["Python", "LangChain", "FastAPI"],
    recommendations=["Add measurable results to projects"],
)
print('VALID OK:', valid.json())

# Missing required field should raise an exception
try:
    bad = ResumeAnalysis(
        professional_summary="Missing lists",
        strengths=["OK"],
        # weaknesses missing
        skills=["Python"],
        recommendations=["Add details"],
    )
    print('BAD CREATED (unexpected):', bad)
except Exception as e:
    print('BAD FAILED AS EXPECTED:', type(e).__name__, str(e))

# Wrong type should raise
try:
    bad2 = ResumeAnalysis(
        professional_summary="Wrong types",
        strengths="not-a-list",  # wrong type
        weaknesses=["ok"],
        skills=["Python"],
        recommendations=["Add details"],
    )
    print('BAD2 CREATED (unexpected):', bad2)
except Exception as e:
    print('BAD2 FAILED AS EXPECTED:', type(e).__name__, str(e))
