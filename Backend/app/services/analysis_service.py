import os
import re

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

from app.prompts.resume_analysis_prompt import resume_analysis_prompt
from app.schemas.resume import ResumeAnalysis
from app.services.ats_ai_service import AIAtsInsightError, analyze_ats_insights
from app.services.ats_service import KEYWORD_SET, score_resume_ats
from langchain_google_genai.chat_models import ChatGoogleGenerativeAIError
import google.genai.errors as genai_errors


class AIServiceError(RuntimeError):
    """Raised when the downstream AI provider returns an error."""
    pass

# Load environment variables from the backend .env file before creating the model.
load_dotenv()


# Create the Gemini chat model object for LLM calls.
# It reads GOOGLE_API_KEY from the environment and initializes the Google GenAI client.
# Model names are based on the current GenAI availability for the API key.
llm = ChatGoogleGenerativeAI(
    model=os.getenv("GOOGLE_MODEL_NAME", "gemini-pro-latest"),
    temperature=0,
    api_key=os.getenv("GOOGLE_API_KEY"),
)

# Create a structured-output wrapper around the chat model that targets the
# `ResumeAnalysis` Pydantic model using JSON Schema mode. This yields a
# Runnable that returns a validated dict or BaseModel instance matching the
# provided Pydantic model.
structured_llm = llm.with_structured_output(ResumeAnalysis, method="json_schema", include_raw=False)


# Build the LangChain LCEL sequence: prompt template -> structured Gemini model -> validated output.
analysis_chain = resume_analysis_prompt | structured_llm


def get_chat_model() -> ChatGoogleGenerativeAI:
    """Return the configured Gemini chat model instance (raw)."""
    return llm


def _build_fallback_resume_analysis(resume_text: str):
    """Return a valid ResumeAnalysis object when the AI provider is unavailable."""
    deterministic_ats = score_resume_ats(resume_text)
    text = resume_text or ""
    lowered = text.lower()

    skill_matches = []
    for keyword in KEYWORD_SET:
        if keyword in lowered and keyword not in {"ai", "ml"}:
            skill_matches.append(keyword.title())
    if not skill_matches:
        skill_matches = ["Problem Solving", "Communication"]

    return ResumeAnalysis(
        professional_summary=(
            "Resume summary is unavailable because the AI analysis service was temporarily unavailable. "
            "Deterministic ATS scoring remains available for review."
        ),
        strengths=[
            "Resume content was analyzed using the deterministic ATS scorer.",
            "Key skill signals were identified from the resume text.",
        ],
        weaknesses=[
            "AI-generated summary was unavailable due to the provider error.",
            "Additional qualitative ATS insight could not be generated at this time.",
        ],
        skills=skill_matches[:10],
        recommendations=[
            "Add a concise professional summary near the top of the resume.",
            "Highlight measurable outcomes and core technologies in the experience section.",
            "Use clear section headers and keep ATS-friendly formatting consistent.",
        ],
        ats=deterministic_ats,
    )


def analyze_resume_text(resume_text: str) -> ResumeAnalysis:
    """Run the resume through the Gemini review and merge in deterministic ATS scoring.

    The AI output provides the resume summary, strengths, weaknesses, skills, and
    recommendations. The ATS numeric values are always sourced from the deterministic
    Phase 6.3 scorer, while the qualitative ATS feedback is appended to the ATS
    issue list without overwriting those numeric values.
    """
    deterministic_ats = score_resume_ats(resume_text)

    try:
        result = analysis_chain.invoke({"resume_text": resume_text})

        if isinstance(result, ResumeAnalysis):
            analysis = result
        else:
            analysis = ResumeAnalysis.model_validate(result)

        analysis.ats = deterministic_ats

        try:
            ai_ats = analyze_ats_insights(resume_text)
        except AIAtsInsightError:
            return analysis

        combined_issues = list(deterministic_ats.issues)
        for issue in ai_ats.potential_issues:
            if issue not in combined_issues:
                combined_issues.append(issue)

        if ai_ats.recommendations:
            for recommendation in ai_ats.recommendations:
                if recommendation not in analysis.recommendations:
                    analysis.recommendations.append(recommendation)

        analysis.ats.issues = combined_issues
        return analysis
    except (ChatGoogleGenerativeAIError, genai_errors.ClientError, Exception):
        return _build_fallback_resume_analysis(resume_text)
