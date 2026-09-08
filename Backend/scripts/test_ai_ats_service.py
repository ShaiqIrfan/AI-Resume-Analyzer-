from app.services.ats_service import score_resume_ats
from app.services.ats_ai_service import analyze_ats_insights

sample_resume = """
Shaiq Irfan
Email: shaiq@example.com | Phone: +1 (555) 123-4567 | Location: Toronto, ON

Summary
AI/ML student with a strong interest in Python, FastAPI, LangChain, and computer vision. Built multiple projects applying machine learning and backend development concepts.

Skills
Python, FastAPI, LangChain, Gemini, SQL, Git, Docker, Machine Learning, Computer Vision, AI

Education
BSc in Computer Science, University of Toronto

Projects
AI Resume Analyzer
- Built an AI powered resume analyzer using Python, FastAPI, and LangChain.
- Integrated Gemini models to analyze resume text and return structured summaries.
- Improved workflow efficiency and enabled automated candidate insight generation.

Experience
Research Assistant, AI Lab
- Developed prototypes using Python and computer vision for image analysis.
- Collaborated with team members on model evaluation and project documentation.
"""

ats_result = score_resume_ats(sample_resume)
ai_result = analyze_ats_insights(sample_resume)

print('ATS_SCORE', ats_result.score)
print('KEYWORD_SCORE', ats_result.keyword_score)
print('STRUCTURE_SCORE', ats_result.structure_score)
print('COMPLETENESS_SCORE', ats_result.completeness_score)
print('SKILLS_SCORE', ats_result.skills_score)
print('READABILITY_SCORE', ats_result.readability_score)
print('AI_INSIGHTS', ai_result.model_dump())
