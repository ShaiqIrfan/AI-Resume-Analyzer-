from app.schemas.resume import ATSAnalysis
from app.services.analysis_service import analyze_resume_text
from app.services.ats_service import score_resume_ats

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

analysis = analyze_resume_text(sample_resume)
deterministic = score_resume_ats(sample_resume)

assert isinstance(analysis.ats, ATSAnalysis)
assert analysis.ats.score == deterministic.score
assert analysis.ats.keyword_score == deterministic.keyword_score
assert analysis.ats.structure_score == deterministic.structure_score
assert analysis.ats.completeness_score == deterministic.completeness_score
assert analysis.ats.skills_score == deterministic.skills_score
assert analysis.ats.readability_score == deterministic.readability_score
assert 0 <= analysis.ats.score <= 100
assert 0 <= analysis.ats.keyword_score <= 30
assert 0 <= analysis.ats.structure_score <= 20
assert 0 <= analysis.ats.completeness_score <= 20
assert 0 <= analysis.ats.skills_score <= 20
assert 0 <= analysis.ats.readability_score <= 10
assert isinstance(analysis.ats.issues, list)
assert len(analysis.ats.issues) >= 0
assert analysis.ats.issues == deterministic.issues or any(issue.lower() for issue in analysis.ats.issues)

print('ANALYSIS_SCORE', analysis.ats.score)
print('KEYWORD_SCORE', analysis.ats.keyword_score)
print('STRUCTURE_SCORE', analysis.ats.structure_score)
print('COMPLETENESS_SCORE', analysis.ats.completeness_score)
print('SKILLS_SCORE', analysis.ats.skills_score)
print('READABILITY_SCORE', analysis.ats.readability_score)
print('ATS_ISSUES', analysis.ats.issues)
print('SUMMARY', analysis.professional_summary)
print('SKILLS', analysis.skills[:5])
