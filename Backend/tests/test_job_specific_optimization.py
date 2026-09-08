import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.main import app
from app.schemas.resume import ResumeOptimization
from app.services.optimization_service import optimize_resume_for_job

client = TestClient(app)


def test_job_specific_optimization_uses_resume_and_job_description(monkeypatch):
    mock_result = {
        "professional_summary": {
            "original": "Python developer with backend experience.",
            "optimized": "Python Developer with applied backend experience in API-driven systems.",
            "notes": ["Tailored toward backend engineering work."],
        },
        "experience": {
            "original": "Built backend APIs.",
            "optimized": "Designed and maintained backend APIs for business workflows.",
            "notes": ["Emphasized relevant backend work."],
        },
        "skills": {
            "original": "Python, FastAPI, SQL",
            "optimized": "Python, FastAPI, SQL, backend systems",
            "notes": ["Reframed skills to match the target role."],
        },
        "bullet_points": {
            "original": "Worked on APIs and data handling.",
            "optimized": "Developed API-driven features and managed data workflows for application services.",
            "notes": ["Improved clarity and role relevance."],
        },
        "optimization_notes": ["Tailored for backend engineering while preserving original facts."],
        "target_role": "Backend Engineer",
        "job_description": "Backend Engineer with Python, FastAPI, SQL, and API design experience.",
        "job_specific": True,
    }

    class MockAnalysis:
        job_title = "Backend Engineer"
        matching_skills = ["Python", "FastAPI", "SQL"]
        matching_keywords = ["Python", "FastAPI", "SQL"]
        relevant_experience = ["Backend API development"]
        missing_skills = []
        missing_keywords = []

    class MockChain:
        def invoke(self, *args, **kwargs):
            return mock_result

    monkeypatch.setattr("app.services.optimization_service.job_specific_optimization_chain", MockChain())
    monkeypatch.setattr("app.services.optimization_service.analyze_resume_against_job", lambda resume_text, job_description: MockAnalysis())

    result = optimize_resume_for_job("Python engineer with backend API work and SQL experience.", "Backend Engineer with Python, FastAPI, SQL, and API design experience.")

    assert isinstance(result, ResumeOptimization)
    assert result.target_role == "Backend Engineer"
    assert result.job_specific is True
    assert result.job_description == "Backend Engineer with Python, FastAPI, SQL, and API design experience."


def test_job_specific_optimization_rejects_empty_inputs():
    with pytest.raises(ValueError, match="resume text"):
        optimize_resume_for_job("   ", "Backend Engineer with Python, FastAPI, and SQL.")

    with pytest.raises(ValueError, match="job description"):
        optimize_resume_for_job("Python engineer with backend work.", "   ")


def test_job_specific_optimization_endpoint_accepts_form_data(monkeypatch):
    mock_result = {
        "professional_summary": {
            "original": "Python engineer with backend systems experience.",
            "optimized": "Python Engineer with backend systems experience across API-driven services.",
            "notes": ["Tailored for backend engineering."]
        },
        "experience": {
            "original": "Built backend services and APIs.",
            "optimized": "Built backend services and APIs for scalable workflow automation.",
            "notes": ["Highlighted relevant engineering work."]
        },
        "skills": {
            "original": "Python, SQL, APIs",
            "optimized": "Python, SQL, REST APIs",
            "notes": ["Used role-aligned terminology."]
        },
        "bullet_points": {
            "original": "Maintained backend services.",
            "optimized": "Maintained backend services and improved system reliability across data-intensive workflows.",
            "notes": ["Made the contribution clearer and ATS-friendly."]
        },
        "optimization_notes": ["Matched the resume language to backend engineering responsibilities while preserving facts."],
        "target_role": "Backend Engineer",
        "job_description": "Backend Engineer with Python, FastAPI, SQL, and API design experience.",
        "job_specific": True,
    }

    monkeypatch.setattr("app.routes.resume.optimize_resume_for_job", lambda resume_text, job_description: ResumeOptimization.model_validate(mock_result))

    response = client.post(
        "/resume/optimize-for-job",
        files={"file": ("resume.pdf", b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF", "application/pdf")},
        data={"job_description": "Backend Engineer with Python, FastAPI, SQL, and API design experience."},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["target_role"] == "Backend Engineer"
    assert payload["optimization"]["job_specific"] is True
    assert payload["optimization"]["job_description"] == "Backend Engineer with Python, FastAPI, SQL, and API design experience."
