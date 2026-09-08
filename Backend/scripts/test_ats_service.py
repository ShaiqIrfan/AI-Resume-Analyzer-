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

result = score_resume_ats(sample_resume)
print("keyword_score:", result.keyword_score)
print("structure_score:", result.structure_score)
print("completeness_score:", result.completeness_score)
print("skills_score:", result.skills_score)
print("readability_score:", result.readability_score)
print("total_score:", result.score)
print("issues:", result.issues)
