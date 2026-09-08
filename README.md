# AI Resume Analyzer

A full-stack AI-powered resume analysis platform built with a FastAPI backend and a Next.js frontend. The project analyzes resumes for ATS alignment, job-fit matching, missing keywords/skills, and role-specific optimization, while keeping a deterministic ATS score as the source of truth.

## Features

- Resume upload and PDF text extraction
- ATS analysis and scoring
- Professional summary, strengths, weaknesses, skills, and recommendations
- Job description analysis and match scoring
- Missing keyword and skill detection
- Role-specific resume optimization
- Before/after optimization comparison
- Optimized PDF export
- Demo-only Pro subscription popup UI ($5/month demo flow only)

## Tech Stack

- Backend: FastAPI, Pydantic, Python
- AI: LangChain + Google Gemini
- PDF processing: pypdf
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- PDF generation: ReportLab

## Project Structure

```bash
AI-Resume-Analyzer/
├── Backend/
│   ├── app/
│   ├── tests/
│   ├── .venv/
│   ├── requirements.txt
│   └── ...
├── Frontend/
│   ├── app/
│   ├── components/
│   ├── config/
│   ├── types/
│   └── ...
├── .env.example
├── .gitignore
├── README.md
└── ...
```

## Local Setup

### 1. Backend

```bash
cd Backend
python -m venv .venv
. .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Create a local `.env` file (not committed) with your own values, for example:

```env
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_MODEL_NAME=gemini-flash-lite-latest
```

Then run:

```bash
uvicorn app.main:app --reload
```

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Demo Pro UI

This project includes a demo-only Pro subscription popup intended for portfolio/demo use only.

- No real payment processing is implemented.
- No database or authentication is used.
- The $5/month popup is a frontend-only demonstration.

## Important Notes

- The ATS score remains authoritative and deterministic.
- Gemini-generated content is used for wording and optimization, not as the source of truth for scoring.
- The generic optimization button is intentionally not used in the current UI; the active flow is role-specific optimization.

## Testing

Backend:

```bash
cd Backend
pytest
```

Frontend:

```bash
cd Frontend
npm run lint
npm run build
```

## License

This project is provided for portfolio and demonstration purposes.
