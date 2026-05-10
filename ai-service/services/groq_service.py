import json
import os
from typing import Any

from openai import OpenAI

GROQ_BASE_URL = "https://api.groq.com/openai/v1"


def _has_client() -> bool:
    return bool(os.getenv("GROQ_API_KEY"))


def _client() -> OpenAI | None:
    key = os.getenv("GROQ_API_KEY")
    if not key:
        return None
    return OpenAI(api_key=key, base_url=GROQ_BASE_URL)


def _model() -> str:
    return os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")


def _extract_json_text(raw: str) -> str:
    text = raw.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    return text


def _complete(prompt: str) -> str:
    client = _client()
    if not client:
        raise RuntimeError("GROQ_API_KEY is not set")

    completion = client.chat.completions.create(
        model=_model(),
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    return (completion.choices[0].message.content or "").strip()


def _parse_json_response(raw: str) -> dict[str, Any]:
    text = _extract_json_text(raw)
    return json.loads(text)


def score_resume(resume_text: str, job_description: str) -> dict[str, Any]:
    if not _has_client():
        return {
            "score": 72,
            "summary": "Stub response: set GROQ_API_KEY for live scoring.",
            "strengths": ["Clear structure", "Relevant keywords"],
            "gaps": ["Quantify impact with metrics"],
        }

    prompt = f"""You are an expert recruiter. Score how well the resume fits the job (0-100) and respond ONLY with minified JSON:
{{"score": number, "summary": string, "strengths": string[], "gaps": string[]}}

Job description:
{job_description}

Resume:
{resume_text}
"""
    try:
        raw = _complete(prompt)
        return _parse_json_response(raw)
    except json.JSONDecodeError:
        return {"score": 0, "summary": raw, "strengths": [], "gaps": []}
    except Exception as e:
        return {"score": 0, "summary": str(e), "strengths": [], "gaps": []}


def skill_suggestions(resume_text: str, target_role: str) -> dict[str, Any]:
    if not _has_client():
        return {
            "skills_to_add": ["System design", "Observability"],
            "learning_path": [
                "Take a distributed systems course",
                "Ship a side project with metrics and tracing",
            ],
            "note": "Stub response: set GROQ_API_KEY for live suggestions.",
        }

    prompt = f"""Given the resume and target role, respond ONLY with minified JSON:
{{"skills_to_add": string[], "learning_path": string[]}}

Target role: {target_role}

Resume:
{resume_text}
"""
    try:
        raw = _complete(prompt)
        return _parse_json_response(raw)
    except json.JSONDecodeError:
        return {"skills_to_add": [], "learning_path": [], "note": raw}
    except Exception as e:
        return {"skills_to_add": [], "learning_path": [], "note": str(e)}
