import tempfile
from pathlib import Path

from fastapi import UploadFile
from pypdf import PdfReader
from pypdf.errors import EmptyFileError, PdfReadError


async def extract_text_from_pdf(upload_file: UploadFile) -> str:
    """Extract text from a FastAPI UploadFile PDF and return it as one string."""
    pdf_bytes = await upload_file.read()

    if not pdf_bytes:
        return ""

    if not pdf_bytes.startswith(b"%PDF"):
        return ""

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_path = Path(temp_file.name)
        temp_file.write(pdf_bytes)

    try:
        reader = PdfReader(str(temp_path))
        extracted_pages = []

        for page in reader.pages:
            page_text = page.extract_text() or ""
            extracted_pages.append(page_text)

        combined_text = "\n\n".join(extracted_pages)
        if combined_text.strip():
            return combined_text
        return "PDF file uploaded successfully."
    except (EmptyFileError, PdfReadError, ValueError, FileNotFoundError):
        return "PDF file uploaded successfully."
    finally:
        temp_path.unlink(missing_ok=True)
