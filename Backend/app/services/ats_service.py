import re
from typing import Dict, List, Set

from app.schemas.resume import ATSAnalysis


KEYWORD_SET: List[str] = [
    "python",
    "java",
    "javascript",
    "typescript",
    "c++",
    "c#",
    "sql",
    "rest",
    "api",
    "apis",
    "fastapi",
    "flask",
    "django",
    "node",
    "node.js",
    "react",
    "mysql",
    "postgresql",
    "mongodb",
    "sqlite",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "linux",
    "git",
    "ci/cd",
    "github",
    "machine learning",
    "ml",
    "ai",
    "artificial intelligence",
    "deep learning",
    "computer vision",
    "nlp",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
    "opencv",
    "langchain",
    "gemini",
    "data analysis",
    "problem solving",
    "leadership",
    "communication",
    "research",
    "project management",
    "teamwork",
]

SECTION_ALIASES: Dict[str, List[str]] = {
    "summary": ["summary", "objective", "profile", "about me"],
    "experience": ["experience", "work experience", "employment", "professional experience", "internship", "internships"],
    "education": ["education", "academic background", "academics", "degree", "university", "college"],
    "skills": ["skills", "technical skills", "core skills", "tools"],
    "projects": ["projects", "project", "portfolio", "personal projects"],
    "certifications": ["certifications", "certificates", "awards"],
    "contact": ["contact", "contact information"],
}


def _normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip().lower()


def _lines_from_text(text: str) -> List[str]:
    return [line.strip() for line in (text or "").splitlines() if line.strip()]


def _find_matches(text: str, keywords: List[str]) -> Set[str]:
    normalized = _normalize_text(text)
    matches: Set[str] = set()
    for keyword in keywords:
        if keyword in normalized:
            matches.add(keyword)
    return matches


def _has_email(text: str) -> bool:
    return bool(re.search(r"[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}", text, re.IGNORECASE))


def _has_phone(text: str) -> bool:
    return bool(re.search(r"(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)\d{3}[-.\s]?\d{4}", text))


def _count_words(text: str) -> int:
    return len(re.findall(r"\b[\w+/.-]+\b", text or ""))


def _detect_sections(text: str) -> Dict[str, bool]:
    normalized = _normalize_text(text)
    sections: Dict[str, bool] = {}

    for section_name, aliases in SECTION_ALIASES.items():
        alias_found = False
        for alias in aliases:
            if alias in normalized:
                alias_found = True
                break
        sections[section_name] = alias_found

    # Additional heuristics for experience/education when headers are absent
    if not sections["experience"] and re.search(r"\b(worked|interned|engineer|developer|analyst|assistant|researcher)\b", normalized):
        sections["experience"] = True
    if not sections["education"] and re.search(r"\b(bachelor|master|phd|degree|university|college|semester|gpa)\b", normalized):
        sections["education"] = True
    if not sections["skills"] and len(_find_matches(text, ["python", "sql", "git", "aws", "java", "fastapi"])) >= 2:
        sections["skills"] = True

    return sections


def _calculate_keyword_score(text: str) -> int:
    matches = _find_matches(text, KEYWORD_SET)
    count = len(matches)

    if count >= 10:
        return 30
    if count >= 7:
        return 24
    if count >= 5:
        return 18
    if count >= 3:
        return 12
    if count >= 1:
        return 6
    return 0


def _calculate_structure_score(text: str) -> int:
    sections = _detect_sections(text)
    score = 0

    score += 3 if sections["summary"] else 0
    score += 5 if sections["experience"] else 0
    score += 4 if sections["education"] else 0
    score += 4 if sections["skills"] else 0
    score += 4 if sections["projects"] else 0

    return min(score, 20)


def _calculate_completeness_score(text: str, sections: Dict[str, bool]) -> int:
    score = 0
    score += 4 if _has_email(text) or _has_phone(text) or "location" in _normalize_text(text) else 0
    score += 4 if sections["education"] else 0
    score += 6 if sections["experience"] or sections["projects"] else 0
    score += 3 if sections["skills"] or len(_find_matches(text, ["python", "sql", "git", "aws", "java", "fastapi"])) >= 2 else 0
    score += 3 if sections["certifications"] or re.search(r"\b(certified|certification|award|awards|hackathon|internship)\b", _normalize_text(text)) else 0
    return min(score, 20)


def _calculate_skills_score(text: str) -> int:
    skills = _find_matches(text, KEYWORD_SET)
    count = len(skills)

    if count >= 10:
        return 20
    if count >= 8:
        return 18
    if count >= 6:
        return 15
    if count >= 4:
        return 12
    if count >= 2:
        return 8
    if count >= 1:
        return 4
    return 0


def _calculate_readability_score(text: str, sections: Dict[str, bool]) -> int:
    words = _count_words(text)
    lines = _lines_from_text(text)
    bullet_lines = sum(1 for line in lines if line.startswith(("-", "*", "•")) or re.match(r"^\d+[\.)]", line))
    section_count = sum(1 for value in sections.values() if value)

    length_score = 4 if words >= 180 else 3 if words >= 100 else 2 if words >= 50 else 1 if words > 0 else 0
    structure_score = 3 if (section_count >= 4 or bullet_lines >= 2) else 2 if section_count >= 2 else 1 if words > 0 else 0

    repeat_ratio = 0.0
    if words > 0:
        word_counts = {}
        for word in re.findall(r"\b[a-zA-Z]+\b", text.lower()):
            word_counts[word] = word_counts.get(word, 0) + 1
        repeated = sum(count for count in word_counts.values() if count > 2)
        repeat_ratio = repeated / words

    penalty = 2 if repeat_ratio > 0.20 else 0
    return max(0, min(10, length_score + structure_score - penalty))


def _build_issues(text: str, sections: Dict[str, bool], keyword_count: int, words: int) -> List[str]:
    issues: List[str] = []

    if not _has_email(text) and not _has_phone(text):
        issues.append("Missing contact information")
    if not sections["summary"]:
        issues.append("Missing professional summary or objective")
    if not sections["experience"] and not sections["projects"]:
        issues.append("Limited experience or project evidence")
    if not sections["education"]:
        issues.append("Missing education section")
    if not sections["skills"]:
        issues.append("Skills section is missing or unclear")
    if keyword_count < 3:
        issues.append("Low keyword coverage")
    if words < 80:
        issues.append("Resume text is too short for strong ATS performance")
    if sum(1 for value in sections.values() if value) < 3:
        issues.append("Resume structure is sparse")

    return issues


def score_resume_ats(resume_text: str) -> ATSAnalysis:
    """Score resume text using deterministic, reproducible ATS rules."""
    clean_text = resume_text or ""
    normalized = _normalize_text(clean_text)
    sections = _detect_sections(clean_text)
    keyword_matches = _find_matches(clean_text, KEYWORD_SET)
    words = _count_words(clean_text)

    keyword_score = _calculate_keyword_score(clean_text)
    structure_score = _calculate_structure_score(clean_text)
    completeness_score = _calculate_completeness_score(clean_text, sections)
    skills_score = _calculate_skills_score(clean_text)
    readability_score = _calculate_readability_score(clean_text, sections)

    total_score = keyword_score + structure_score + completeness_score + skills_score + readability_score
    total_score = max(0, min(100, total_score))

    issues = _build_issues(clean_text, sections, len(keyword_matches), words)

    return ATSAnalysis(
        score=total_score,
        keyword_score=keyword_score,
        structure_score=structure_score,
        completeness_score=completeness_score,
        skills_score=skills_score,
        readability_score=readability_score,
        issues=issues,
    )
