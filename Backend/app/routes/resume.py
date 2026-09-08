import re
from io import BytesIO

from fastapi import APIRouter, File, Form, HTTPException, Response, UploadFile
from pydantic import BaseModel
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, ListFlowable, ListItem

from app.services.analysis_service import analyze_resume_text, AIServiceError
from app.services.job_analysis_service import JobAnalysisError, analyze_resume_against_job
from app.services.pdf_service import extract_text_from_pdf
from app.services.optimization_service import ResumeOptimizationError, optimize_resume_for_job, optimize_resume_text
from app.schemas.resume import DownloadOptimizedResumeRequest, JobSpecificAnalysis, ResumeAnalysis, ResumeOptimization


class ResumeAnalyzeResponse(BaseModel):
    filename: str
    analysis: ResumeAnalysis


class ResumeOptimizeResponse(BaseModel):
    filename: str
    optimization: ResumeOptimization


class ResumeJobAnalysisResponse(BaseModel):
    filename: str
    analysis: JobSpecificAnalysis


class ResumeJobOptimizeResponse(BaseModel):
    filename: str
    target_role: str
    optimization: ResumeOptimization


router = APIRouter(prefix="/resume", tags=["resume"])


@router.get("/health")
def resume_health():
    return {"message": "Resume route is working"}


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),  # FastAPI uses this to expose a file input in Swagger as multipart/form-data
):
    # Check that a filename is present.
    if file.filename is None or file.filename == "":
        raise HTTPException(status_code=400, detail="No file uploaded.")

    # Validate the file extension before trying to process it.
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # Ask the service layer to extract text from the uploaded PDF file.
    extracted_text = await extract_text_from_pdf(file)

    # Return the filename and extracted text in the JSON response.
    return {"filename": file.filename, "text": extracted_text}


@router.post("/analyze", response_model=ResumeAnalyzeResponse)
async def analyze_resume(
    file: UploadFile = File(...),
):
    # Reject requests without a file or with no filename.
    if file.filename is None or file.filename == "":
        raise HTTPException(status_code=400, detail="No file uploaded.")

    # Validate that the uploaded file is a PDF by extension.
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # Extract text from the PDF using the reusable PDF service.
    resume_text = await extract_text_from_pdf(file)

    # Send the extracted text through the analysis service chain.
    try:
        analysis_result = analyze_resume_text(resume_text)
    except AIServiceError as e:
        # Convert downstream AI provider errors into a 503 Service Unavailable
        raise HTTPException(status_code=503, detail=f"AI service error: {str(e)}")

    # Return a JSON payload containing the filename and the AI analysis.
    return ResumeAnalyzeResponse(filename=file.filename, analysis=analysis_result)


@router.post("/optimize", response_model=ResumeOptimizeResponse)
async def optimize_resume(
    file: UploadFile = File(...),
):
    if file.filename is None or file.filename == "":
        raise HTTPException(status_code=400, detail="No file uploaded.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    resume_text = await extract_text_from_pdf(file)

    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="The uploaded PDF does not contain readable resume text.")

    try:
        optimized_result = optimize_resume_text(resume_text)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except ResumeOptimizationError as exc:
        raise HTTPException(status_code=503, detail=f"Resume optimization failed: {str(exc)}") from exc

    return ResumeOptimizeResponse(filename=file.filename, optimization=optimized_result)


@router.post("/optimize-for-job", response_model=ResumeJobOptimizeResponse)
async def optimize_resume_for_job_route(
    file: UploadFile = File(...),
    job_description: str = Form(...),
):
    if file.filename is None or file.filename == "":
        raise HTTPException(status_code=400, detail="No file uploaded.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    cleaned_job_description = (job_description or "").strip()
    if len(cleaned_job_description) < 20:
        raise HTTPException(status_code=400, detail="Job description is too short. Please provide the role requirements and responsibilities.")
    if len(cleaned_job_description) > 20000:
        raise HTTPException(status_code=400, detail="Job description is too long. Please keep it concise.")

    resume_text = await extract_text_from_pdf(file)
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="The uploaded PDF does not contain readable resume text.")

    try:
        optimized_result = optimize_resume_for_job(resume_text, cleaned_job_description)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except ResumeOptimizationError as exc:
        raise HTTPException(status_code=503, detail=f"Job-specific resume optimization failed: {str(exc)}") from exc

    return ResumeJobOptimizeResponse(
        filename=file.filename,
        target_role=optimized_result.target_role or "Target Role",
        optimization=optimized_result,
    )


@router.post("/analyze-job", response_model=ResumeJobAnalysisResponse)
async def analyze_resume_job_fit(
    file: UploadFile = File(...),
    job_description: str = Form(...),
):
    if file.filename is None or file.filename == "":
        raise HTTPException(status_code=400, detail="No file uploaded.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    cleaned_job_description = (job_description or "").strip()
    if len(cleaned_job_description) < 20:
        raise HTTPException(status_code=400, detail="Job description is too short. Please provide the role requirements and responsibilities.")
    if len(cleaned_job_description) > 20000:
        raise HTTPException(status_code=400, detail="Job description is too long. Please keep it concise.")

    resume_text = await extract_text_from_pdf(file)
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="The uploaded PDF does not contain readable resume text.")

    try:
        job_analysis = analyze_resume_against_job(resume_text, cleaned_job_description)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except JobAnalysisError as exc:
        raise HTTPException(status_code=503, detail=f"Job analysis failed: {str(exc)}") from exc

    return ResumeJobAnalysisResponse(filename=file.filename, analysis=job_analysis)


def _sanitize_filename(name: str, fallback: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "_", (name or fallback).strip())
    cleaned = cleaned.strip("._")
    return cleaned or fallback


def _build_optimized_resume_pdf(optimization: ResumeOptimization, target_role: str = "") -> bytes:
    if optimization is None:
        raise ValueError("No optimized resume content was provided for export.")

    styles = getSampleStyleSheet()
    title_style = styles["Title"]
    heading_style = styles["Heading2"]
    normal_style = styles["BodyText"]
    normal_style.leading = 18
    story = []

    story.append(Paragraph("Optimized Resume", title_style))
    if target_role.strip():
        story.append(Paragraph(f"Target Role: {target_role.strip()}", normal_style))
    story.append(Spacer(1, 12))

    sections = [
        ("Professional Summary", optimization.professional_summary.optimized if optimization.professional_summary else ""),
        ("Skills", optimization.skills.optimized if optimization.skills else ""),
        ("Experience", optimization.experience.optimized if optimization.experience else ""),
        ("Key Accomplishments", optimization.bullet_points.optimized if optimization.bullet_points else ""),
    ]

    for title, body in sections:
        if body and body.strip():
            story.append(Paragraph(title, heading_style))
            story.append(Paragraph(body.strip().replace("\n", "<br/><br/>"), normal_style))
            story.append(Spacer(1, 8))

    if optimization.optimization_notes:
        meaningful_notes = [note.strip() for note in optimization.optimization_notes if note and note.strip()]
        if meaningful_notes:
            story.append(Paragraph("Optimization Notes", heading_style))
            story.append(
                ListFlowable(
                    [ListItem(Paragraph(note, normal_style), bulletType="bullet") for note in meaningful_notes],
                    bulletType="bullet",
                    leftIndent=20,
                    spaceBefore=6,
                    spaceAfter=6,
                )
            )

    if optimization.before_after_comparison:
        story.append(Paragraph("Before vs After", heading_style))
        for item in optimization.before_after_comparison:
            section_name = item.section.replace("_", " ").title()
            story.append(Paragraph(f"{section_name}", styles["Heading3"]))
            story.append(Paragraph(f"<b>Original:</b> {item.original_text.strip().replace(chr(10), '<br/>') or 'Not provided.'}", normal_style))
            story.append(Paragraph(f"<b>Optimized:</b> {item.optimized_text.strip().replace(chr(10), '<br/>') or 'Not provided.'}", normal_style))
            if item.reason_for_change.strip():
                story.append(Paragraph(f"<b>Why this changed:</b> {item.reason_for_change.strip()}", normal_style))
            story.append(Spacer(1, 8))

    if not any(
        (
            (optimization.professional_summary and optimization.professional_summary.optimized and optimization.professional_summary.optimized.strip()),
            (optimization.skills and optimization.skills.optimized and optimization.skills.optimized.strip()),
            (optimization.experience and optimization.experience.optimized and optimization.experience.optimized.strip()),
            (optimization.bullet_points and optimization.bullet_points.optimized and optimization.bullet_points.optimized.strip()),
            optimization.optimization_notes,
            optimization.before_after_comparison,
        )
    ):
        raise ValueError("The provided optimization data does not contain any exportable resume content.")

    buffer = BytesIO()
    pdf = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=50, rightMargin=50, topMargin=50, bottomMargin=50)
    pdf.build(story)
    return buffer.getvalue()


@router.post("/download-optimized")
async def download_optimized_resume(payload: DownloadOptimizedResumeRequest):
    try:
        pdf_bytes = _build_optimized_resume_pdf(payload.optimization, payload.target_role)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    original_name = _sanitize_filename(payload.filename, "resume.pdf")
    is_job_specific = bool(payload.target_role.strip()) or bool(getattr(payload.optimization, "job_specific", False))
    filename = "optimized_resume_for_job.pdf" if is_job_specific else "optimized_resume.pdf"
    if original_name and original_name.lower().endswith(".pdf"):
        stem = original_name[:-4]
        filename = f"{_sanitize_filename(stem, 'optimized_resume')}_optimized.pdf"
    if is_job_specific and not filename.endswith("_for_job.pdf"):
        filename = "optimized_resume_for_job.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
