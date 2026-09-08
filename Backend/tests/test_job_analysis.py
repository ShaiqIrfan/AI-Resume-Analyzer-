import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.main import app
from app.schemas.resume import JobSpecificAnalysis
from app.services.job_analysis_service import analyze_resume_against_job

client = TestClient(app)


def test_job_analysis_returns_structured_response(monkeypatch):
    mock_result = {
        "job_title": "Senior Backend Engineer",
        "matching_skills": ["Python", "FastAPI", "APIs"],
        "missing_or_weak_requirements": ["Cloud deployment experience"],
        "keyword_alignment": ["Python: present", "SQL: present"],
        "experience_alignment": "Candidate has backend engineering experience aligned to API and service work.",
        "resume_strengths": ["Strong Python backend experience", "API-focused delivery"],
        "improvement_suggestions": ["Add deployment and CI/CD examples"],
        "overall_fit": "Strong overall fit for backend-focused responsibilities with a few gaps in cloud operations.",
    }

    class MockChain:
        def invoke(self, *args, **kwargs):
            return mock_result

    monkeypatch.setattr("app.services.job_analysis_service.job_analysis_chain", MockChain())

    result = analyze_resume_against_job("Python developer with FastAPI and SQL experience.", "Senior Backend Engineer role requiring Python, APIs, and SQL.")

    assert isinstance(result, JobSpecificAnalysis)
    assert result.job_title == "Senior Backend Engineer"
    assert result.ats_score_remains_authoritative is True


def test_job_analysis_rejects_empty_input():
    with pytest.raises(ValueError, match="resume text"):
        analyze_resume_against_job("   ", "Senior backend engineer role with Python and FastAPI.")

    with pytest.raises(ValueError, match="job description"):
        analyze_resume_against_job("Python developer with FastAPI experience.", "   ")


def test_job_analysis_endpoint_requires_description():
    file_payload = {"file": ("resume.pdf", b'%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF', "application/pdf")}
    response = client.post("/resume/analyze-job", files=file_payload, data={})
    assert response.status_code in {400, 422}
