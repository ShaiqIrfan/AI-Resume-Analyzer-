import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai.chat_models import ChatGoogleGenerativeAIError
import google.genai.errors as genai_errors

from app.prompts.ats_insights_prompt import ats_insights_prompt
from app.schemas.resume import AIAtsInsights


load_dotenv()


llm = ChatGoogleGenerativeAI(
    model=os.getenv("GOOGLE_MODEL_NAME", "gemini-flash-lite-latest"),
    temperature=0,
    api_key=os.getenv("GOOGLE_API_KEY"),
)


structured_llm = llm.with_structured_output(AIAtsInsights, method="json_schema", include_raw=False)
ats_ai_chain = ats_insights_prompt | structured_llm


class AIAtsInsightError(RuntimeError):
    """Raised when the AI ATS insight provider returns an error."""
    pass


def get_ai_ats_model() -> ChatGoogleGenerativeAI:
    return llm


def analyze_ats_insights(resume_text: str) -> AIAtsInsights:
    """Get qualitative ATS insights from Gemini. The numeric ATS score remains rule-based and is not generated here."""
    try:
        result = ats_ai_chain.invoke({"resume_text": resume_text})
        if isinstance(result, AIAtsInsights):
            return result
        return AIAtsInsights.model_validate(result)
    except ChatGoogleGenerativeAIError as e:
        raise AIAtsInsightError(str(e)) from e
    except genai_errors.ClientError as e:
        raise AIAtsInsightError(str(e)) from e
    except Exception as e:
        raise AIAtsInsightError(str(e)) from e
