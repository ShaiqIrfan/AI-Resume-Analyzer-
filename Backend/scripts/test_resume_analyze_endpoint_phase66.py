from pathlib import Path

from fastapi.testclient import TestClient
from pypdf import PdfWriter

from app.main import app


def build_sample_pdf(path: Path) -> None:
    writer = PdfWriter()
    writer.add_blank_page(width=612, height=792)
    with path.open("wb") as f:
        writer.write(f)


client = TestClient(app)
pdf_path = Path("./tmp_sample_resume.pdf")
build_sample_pdf(pdf_path)

with pdf_path.open("rb") as f:
    response = client.post(
        "/resume/analyze",
        files={"file": ("resume.pdf", f.read(), "application/pdf")},
    )

print("STATUS", response.status_code)
body = response.json()
print("FILENAME", body["filename"])
print("HAS_PROFESSIONAL_SUMMARY", "professional_summary" in body["analysis"])
print("HAS_STRENGTHS", "strengths" in body["analysis"])
print("HAS_WEAKNESSES", "weaknesses" in body["analysis"])
print("HAS_SKILLS", "skills" in body["analysis"])
print("HAS_RECOMMENDATIONS", "recommendations" in body["analysis"])
print("HAS_ATS", "ats" in body["analysis"])
print("ATS_SCORE", body["analysis"]["ats"]["score"])
print("ATS_KEYWORD_SCORE", body["analysis"]["ats"]["keyword_score"])
print("ATS_STRUCTURE_SCORE", body["analysis"]["ats"]["structure_score"])
print("ATS_COMPLETENESS_SCORE", body["analysis"]["ats"]["completeness_score"])
print("ATS_SKILLS_SCORE", body["analysis"]["ats"]["skills_score"])
print("ATS_READABILITY_SCORE", body["analysis"]["ats"]["readability_score"])
print("ATS_ISSUES", body["analysis"]["ats"]["issues"])
print("OPENAPI_HAS_ATS", "ats" in app.openapi()["components"]["schemas"]["ResumeAnalysis"]["properties"])
print("SCHEMA_KEYS", sorted(app.openapi()["components"]["schemas"]["ResumeAnalysis"]["properties"].keys()))

pdf_path.unlink(missing_ok=True)
