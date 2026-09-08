import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai.chat_models import ChatGoogleGenerativeAIError
import google.genai.errors as genai_errors

from app.prompts.job_analysis_prompt import job_analysis_prompt
from app.schemas.resume import JobSpecificAnalysis

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model=os.getenv("GOOGLE_MODEL_NAME", "gemini-flash-lite-latest"),
    temperature=0,
    api_key=os.getenv("GOOGLE_API_KEY"),
)

structured_llm = llm.with_structured_output(JobSpecificAnalysis, method="json_schema", include_raw=False)
job_analysis_chain = job_analysis_prompt | structured_llm


class JobAnalysisError(RuntimeError):
    """Raised when the job-specific AI analysis fails."""


def _normalize_text(value: str | None) -> str:
    return (value or "").strip().lower()


def _count_nonempty(items) -> int:
    return sum(1 for item in (items or []) if isinstance(item, str) and item.strip())


def _count_present_keyword_entries(keyword_entries) -> int:
    count = 0
    for entry in keyword_entries or []:
        if not isinstance(entry, str):
            continue
        lowered = entry.lower()
        if ": present" in lowered or "present" in lowered or "matches" in lowered or "aligned" in lowered:
            count += 1
    return count


def calculate_job_match_score(analysis: JobSpecificAnalysis) -> int:
    """Calculate a deterministic, reproducible job match score from structured evidence.

    The score combines direct skills match, keyword coverage, relevant experience, and
    penalty for important missing requirements. It stays separate from the deterministic
    ATS score, which remains authoritative for ATS evaluation.
    """
    if not isinstance(analysis, JobSpecificAnalysis):
        raise ValueError("analysis must be a JobSpecificAnalysis instance.")

    skill_score = min(_count_nonempty(analysis.matching_skills) * 10, 30)
    keyword_score = min(_count_present_keyword_entries(analysis.keyword_alignment) * 8, 25)
    experience_score = min(_count_nonempty(analysis.relevant_experience) * 10, 25)
    requirement_score = max(0, 20 - (_count_nonempty(analysis.missing_requirements) * 7) - (_count_nonempty(analysis.missing_or_weak_requirements) * 5))

    total = skill_score + keyword_score + experience_score + requirement_score
    total = max(0, min(100, total))
    return int(total)


def _build_score_explanation(analysis: JobSpecificAnalysis, score: int) -> str:
    if score >= 80:
        match_band = "Strong match"
    elif score >= 60:
        match_band = "Good match"
    elif score >= 40:
        match_band = "Moderate match"
    else:
        match_band = "Low match"

    matches = _count_nonempty(analysis.matching_skills)
    keyword_matches = _count_present_keyword_entries(analysis.keyword_alignment)
    missing = _count_nonempty(analysis.missing_requirements)

    summary = f"{match_band}: the resume demonstrates {matches} relevant matching skill(s), {keyword_matches} aligned keyword area(s), and {missing} important missing requirement(s) from the target role."
    if analysis.relevant_experience:
        summary += " The experience sections are relevant to the role and support the match."
    if missing:
        summary += " Additional evidence for the missing requirements would improve alignment."
    return summary


def analyze_resume_against_job(resume_text: str, job_description: str) -> JobSpecificAnalysis:
    """Analyze how a resume aligns to a target job description using Gemini.

    The deterministic ATS score remains authoritative and is not replaced by this analysis.
    The final job match score is computed deterministically from the structured evidence.
    """
    if resume_text is None or not str(resume_text).strip():
        raise ValueError("resume text is required for job analysis.")
    if job_description is None or not str(job_description).strip():
        raise ValueError("job description is required for job analysis.")
    if len(str(job_description).strip()) < 20:
        raise ValueError("job description is too short for meaningful analysis.")

    try:
        result = job_analysis_chain.invoke({
            "resume_text": resume_text,
            "job_description": job_description,
        })
        if isinstance(result, JobSpecificAnalysis):
            analysis = result
        else:
            analysis = JobSpecificAnalysis.model_validate(result)

        analysis.job_match_score = calculate_job_match_score(analysis)
        analysis.score_explanation = _build_score_explanation(analysis, analysis.job_match_score)
        return analysis
    except (ChatGoogleGenerativeAIError, genai_errors.ClientError, ValueError, TypeError) as exc:
        raise JobAnalysisError(str(exc)) from exc
    except Exception as exc:
        raise JobAnalysisError(str(exc)) from exc
