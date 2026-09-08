import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.schemas.resume import JobSpecificAnalysis
from app.services.job_analysis_service import analyze_resume_against_job, calculate_job_match_score


def test_missing_keywords_and_skills_are_returned_from_structured_analysis():
    analysis = JobSpecificAnalysis(
        job_title="Senior Backend Engineer",
        matching_skills=["Python", "FastAPI"],
        matching_keywords=["Python", "FastAPI"],
        missing_or_weak_requirements=["Docker"],
        missing_requirements=["Docker"],
        missing_keywords=["Docker", "AWS"],
        missing_skills=["Kubernetes", "CI/CD"],
        keyword_alignment=["Python: present", "FastAPI: present", "Docker: missing"],
        relevant_experience=["Backend API development"],
        experience_alignment="Strong backend API work with a gap in deployment tooling.",
        resume_strengths=["Python backend work"],
        improvement_suggestions=["Add deployment and infrastructure examples."],
        overall_fit="Reasonable backend fit with deployment gaps.",
        score_explanation="Strong backend fit with a few missing deployment skills.",
        job_match_score=78,
    )

    assert analysis.missing_keywords == ["Docker", "AWS"]
    assert analysis.missing_skills == ["Kubernetes", "CI/CD"]
    assert calculate_job_match_score(analysis) >= 0


def test_analysis_does_not_mark_present_items_as_missing():
    analysis = JobSpecificAnalysis(
        job_title="Backend Engineer",
        matching_skills=["Python", "FastAPI", "PostgreSQL"],
        matching_keywords=["Python", "FastAPI", "PostgreSQL"],
        missing_or_weak_requirements=[],
        missing_requirements=[],
        missing_keywords=[],
        missing_skills=[],
        keyword_alignment=["Python: present", "FastAPI: present", "PostgreSQL: present"],
        relevant_experience=["Backend API development"],
        experience_alignment="Role matches backend API experience and database development.",
        resume_strengths=["Backend APIs"],
        improvement_suggestions=[],
        overall_fit="Strong fit.",
        score_explanation="Strong match. No important missing items identified.",
        job_match_score=90,
    )

    assert not any(item.lower() in {"python", "fastapi", "postgresql"} for item in analysis.missing_keywords)
    assert analysis.missing_skills == []


def test_missing_keyword_and_skill_validation_handles_empty_lists():
    analysis = JobSpecificAnalysis(
        job_title="Software Engineer",
        matching_skills=[],
        matching_keywords=[],
        missing_or_weak_requirements=[],
        missing_requirements=[],
        missing_keywords=[],
        missing_skills=[],
        keyword_alignment=[],
        relevant_experience=[],
        experience_alignment="No relevant experience identified.",
        resume_strengths=[],
        improvement_suggestions=[],
        overall_fit="Limited fit.",
        score_explanation="Low match with limited evidence.",
        job_match_score=20,
    )

    assert analysis.missing_keywords == []
    assert analysis.missing_skills == []
    assert 0 <= analysis.job_match_score <= 100


def test_analyze_resume_against_job_rejects_empty_job_description():
    with pytest.raises(ValueError, match="job description"):
        analyze_resume_against_job("Python engineer with FastAPI experience.", "   ")
