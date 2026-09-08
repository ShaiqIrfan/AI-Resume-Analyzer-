import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.main import app
from app.schemas.resume import ResumeOptimization, ResumeOptimizationSection
from app.services.ats_service import score_resume_ats


client = TestClient(app)


def test_optimize_resume_returns_structured_response(monkeypatch):
    from app.services import optimization_service

    mock_result = {
        "professional_summary": {
            "original": "Software engineer with Python and backend experience.",
            "optimized": "Software Engineer with hands-on Python and backend development experience.",
            "notes": ["Improved clarity and professionalism."],
        },
        "experience": {
            "original": "Worked on backend systems and APIs.",
            "optimized": "Developed backend systems and REST APIs to support application workflows.",
            "notes": ["Strengthened action verbs and outcome wording."],
        },
        "skills": {
            "original": "python, api, git",
            "optimized": "Python, REST APIs, Git",
            "notes": ["Standardized terminology."],
        },
        "bullet_points": {
            "original": "Built APIs and handled data.",
            "optimized": "Built secure REST APIs and managed data workflows for application features.",
            "notes": ["Made responsibilities more outcome-oriented."],
        },
        "optimization_notes": ["Kept the original facts and improved wording only."],
        "before_after_comparison": [
            {
                "section": "professional_summary",
                "original_text": "Software engineer with Python and backend experience.",
                "optimized_text": "Software Engineer with hands-on Python and backend development experience.",
                "reason_for_change": "Improved clarity and job-relevant phrasing while preserving the original meaning.",
            }
        ],
    }

    class MockChain:
        def invoke(self, *args, **kwargs):
            return mock_result

    monkeypatch.setattr(optimization_service, "optimization_chain", MockChain())

    result = optimization_service.optimize_resume_text("Python engineer with backend API experience")

    assert isinstance(result, ResumeOptimization)
    assert result.professional_summary.original == mock_result["professional_summary"]["original"]
    assert result.professional_summary.optimized == mock_result["professional_summary"]["optimized"]
    assert result.optimization_notes[0].startswith("Kept")
    assert result.before_after_comparison[0].section == "professional_summary"
    assert result.before_after_comparison[0].original_text == mock_result["before_after_comparison"][0]["original_text"]
    assert result.before_after_comparison[0].optimized_text == mock_result["before_after_comparison"][0]["optimized_text"]


def test_optimize_resume_rejects_empty_input():
    from app.services.optimization_service import optimize_resume_text

    with pytest.raises(ValueError, match="resume text"):
        optimize_resume_text("   ")


def test_ats_score_remains_authoritative_for_optimization_inputs():
    resume_text = "Python developer with FastAPI, SQL, and cloud experience. Built APIs and dashboards."
    ats = score_resume_ats(resume_text)
    assert 0 <= ats.score <= 100
    assert ats.issues is not None


def test_optimize_endpoint_handles_missing_file():
    response = client.post("/resume/optimize")
    assert response.status_code in {400, 422}


def test_download_optimized_resume_returns_document():
    payload = {
        "filename": "resume.pdf",
        "optimization": {
            "professional_summary": {
                "original": "Software engineer with Python and backend experience.",
                "optimized": "Software Engineer with Python and backend development experience.",
                "notes": ["Improved wording without changing the facts."],
            },
            "experience": {
                "original": "Worked on web applications.",
                "optimized": "Developed and optimized scalable web applications using Python and FastAPI.",
                "notes": ["Used stronger action verbs and more specific wording."],
            },
            "skills": {
                "original": "Python, SQL",
                "optimized": "Python, SQL, FastAPI",
                "notes": ["Improved skill consistency."],
            },
            "bullet_points": {
                "original": "Built APIs.",
                "optimized": "Developed and maintained REST APIs to support application workflows.",
                "notes": ["Clarified the deliverable."],
            },
            "optimization_notes": ["Preserved the original meaning."],
            "before_after_comparison": [
                {
                    "section": "experience",
                    "original_text": "Worked on web applications.",
                    "optimized_text": "Developed and optimized scalable web applications using Python and FastAPI.",
                    "reason_for_change": "Improved clarity and technical specificity.",
                }
            ],
        }
    }

    response = client.post("/resume/download-optimized", json=payload)

    assert response.status_code == 200
    assert "application/pdf" in response.headers.get("content-type", "")
    assert "attachment; filename=" in response.headers.get("content-disposition", "")
    assert ".pdf" in response.headers.get("content-disposition", "")

    document_bytes = response.content
    assert len(document_bytes) > 0
    assert document_bytes[:5] == b"%PDF-"


def test_download_optimized_resume_rejects_invalid_payload():
    response = client.post("/resume/download-optimized", json={"optimization": {}})
    assert response.status_code == 422
