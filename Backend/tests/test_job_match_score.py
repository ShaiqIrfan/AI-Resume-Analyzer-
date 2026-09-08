import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.schemas.resume import JobSpecificAnalysis
from app.services.job_analysis_service import calculate_job_match_score


def test_calculate_job_match_score_returns_expected_range():
    analysis = JobSpecificAnalysis(
        job_title="Senior Backend Engineer",
        matching_skills=["Python", "FastAPI", "SQL", "REST APIs"],
        missing_or_weak_requirements=["AWS"],
        keyword_alignment=["Python: present", "FastAPI: present", "SQL: present", "AWS: missing"],
        experience_alignment="Strong backend development experience with Python services and data access layers.",
        resume_strengths=["Backend API development", "Python engineering", "Database integration"],
        improvement_suggestions=["Add more cloud deployment examples"],
        overall_fit="Strong fit for backend work with one gap in cloud deployment experience.",
        matching_keywords=["Python", "FastAPI", "SQL"],
        relevant_experience=["Backend API development", "Database integration"],
        missing_requirements=["AWS deployment"],
        score_explanation="Strong match based on backend experience and core technical skills.",
    )

    score = calculate_job_match_score(analysis)

    assert 0 <= score <= 100
    assert score > 65


def test_calculate_job_match_score_penalizes_missing_requirements():
    strong_match = JobSpecificAnalysis(
        job_title="Senior Backend Engineer",
        matching_skills=["Python", "FastAPI", "SQL"],
        missing_or_weak_requirements=[],
        keyword_alignment=["Python: present", "FastAPI: present", "SQL: present"],
        experience_alignment="Strong backend experience matched to the role.",
        resume_strengths=["Backend API development", "Database work"],
        improvement_suggestions=[],
        overall_fit="Strong fit.",
        matching_keywords=["Python", "FastAPI", "SQL"],
        relevant_experience=["Backend API development", "Database work"],
        missing_requirements=[],
        score_explanation="Strong fit based on direct evidence.",
    )

    weak_match = JobSpecificAnalysis(
        job_title="Senior Backend Engineer",
        matching_skills=["Python"],
        missing_or_weak_requirements=["FastAPI", "SQL", "AWS", "Docker"],
        keyword_alignment=["Python: present", "FastAPI: missing", "SQL: missing", "AWS: missing", "Docker: missing"],
        experience_alignment="Only limited experience matches the role.",
        resume_strengths=["Python scripting"],
        improvement_suggestions=["Add backend system examples"],
        overall_fit="Limited fit.",
        matching_keywords=["Python"],
        relevant_experience=["Python scripting"],
        missing_requirements=["FastAPI", "SQL", "AWS", "Docker"],
        score_explanation="Limited fit due to several missing core requirements.",
    )

    assert calculate_job_match_score(strong_match) > calculate_job_match_score(weak_match)
