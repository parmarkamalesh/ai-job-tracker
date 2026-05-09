import json
import os
from typing import Any

from anthropic import Anthropic


def _has_client() -> bool:
    return bool(os.getenv("ANTHROPIC_API_KEY"))


def score_resume(resume_text: str, job_description: str) -> dict[str, Any]:
    if not _has_client():
        return {
            "score": 72,
            "summary": "Stub response: set ANTHROPIC_API_KEY for live scoring.",
            "strengths": ["Clear structure", "Relevant keywords"],
            "gaps": ["Quantify impact with metrics"],
        }

    client = Anthropic()
    model = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
    prompt = f"""You are an expert recruiter. Score how well the resume fits the job (0-100) and respond ONLY with minified JSON:
{{"score": number, "summary": string, "strengths": string[], "gaps": string[]}}

Job description:
{job_description}

Resume:
{resume_text}
"""
    message = client.messages.create(
        model=model,
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    text = ""
    for block in message.content:
        if block.type == "text":
            text += block.text
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"score": 0, "summary": text, "strengths": [], "gaps": []}


def skill_suggestions(resume_text: str, target_role: str) -> dict[str, Any]:
    if not _has_client():
        return {
            "skills_to_add": ["System design", "Observability"],
            "learning_path": [
                "Take a distributed systems course",
                "Ship a side project with metrics and tracing",
            ],
            "note": "Stub response: set ANTHROPIC_API_KEY for live suggestions.",
        }

    client = Anthropic()
    model = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
    prompt = f"""Given the resume and target role, respond ONLY with minified JSON:
{{"skills_to_add": string[], "learning_path": string[]}}

Target role: {target_role}

Resume:
{resume_text}
"""
    message = client.messages.create(
        model=model,
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    text = ""
    for block in message.content:
        if block.type == "text":
            text += block.text
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"skills_to_add": [], "learning_path": [], "note": text}
