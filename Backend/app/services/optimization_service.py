import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai.chat_models import ChatGoogleGenerativeAIError
import google.genai.errors as genai_errors

from app.prompts.resume_optimization_prompt import job_specific_optimization_prompt, resume_optimization_prompt
from app.schemas.resume import ResumeOptimization
from app.services.job_analysis_service import analyze_resume_against_job

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model=os.getenv("GOOGLE_MODEL_NAME", "gemini-flash-lite-latest"),
    temperature=0,
    api_key=os.getenv("GOOGLE_API_KEY"),
)

structured_llm = llm.with_structured_output(ResumeOptimization, method="json_schema", include_raw=False)
optimization_chain = resume_optimization_prompt | structured_llm
job_specific_optimization_chain = job_specific_optimization_prompt | structured_llm


class ResumeOptimizationError(RuntimeError):
    """Raised when the resume optimization provider fails."""


def optimize_resume_text(resume_text: str) -> ResumeOptimization:
    """Improve the wording of an existing resume without inventing facts.

    The deterministic ATS score remains authoritative and is not modified here.
    """
    if resume_text is None or not str(resume_text).strip():
        raise ValueError("resume text is required for optimization.")

    try:
        result = optimization_chain.invoke({"resume_text": resume_text})
        if isinstance(result, ResumeOptimization):
            return result
        return ResumeOptimization.model_validate(result)
    except (ChatGoogleGenerativeAIError, genai_errors.ClientError, ValueError, TypeError) as exc:
        raise ResumeOptimizationError(str(exc)) from exc
    except Exception as exc:
        raise ResumeOptimizationError(str(exc)) from exc


def optimize_resume_for_job(resume_text: str, job_description: str) -> ResumeOptimization:
    """Tailor resume wording toward a specific job without inventing qualifications."""
    if resume_text is None or not str(resume_text).strip():
        raise ValueError("resume text is required for job-specific optimization.")
    if job_description is None or not str(job_description).strip():
        raise ValueError("job description is required for job-specific optimization.")

    job_analysis = analyze_resume_against_job(resume_text, job_description)

    try:
        result = job_specific_optimization_chain.invoke({
            "resume_text": resume_text,
            "job_description": job_description,
            "target_role": job_analysis.job_title or "Target Role",
            "matching_skills": ", ".join(job_analysis.matching_skills) if job_analysis.matching_skills else "None identified",
            "matching_keywords": ", ".join(job_analysis.matching_keywords) if job_analysis.matching_keywords else "None identified",
            "relevant_experience": ", ".join(job_analysis.relevant_experience) if job_analysis.relevant_experience else "None identified",
            "missing_skills": ", ".join(job_analysis.missing_skills) if job_analysis.missing_skills else "None identified",
            "missing_keywords": ", ".join(job_analysis.missing_keywords) if job_analysis.missing_keywords else "None identified",
        })
        if isinstance(result, ResumeOptimization):
            optimization = result
        else:
            optimization = ResumeOptimization.model_validate(result)

        optimization.target_role = optimization.target_role or job_analysis.job_title or "Target Role"
        optimization.job_description = job_description
        optimization.job_specific = True
        if not optimization.optimization_notes:
            optimization.optimization_notes.append("Tailored for the target role without fabricating missing qualifications.")
        return optimization
    except (ChatGoogleGenerativeAIError, genai_errors.ClientError, ValueError, TypeError) as exc:
        raise ResumeOptimizationError(str(exc)) from exc
    except Exception as exc:
        raise ResumeOptimizationError(str(exc)) from exc
