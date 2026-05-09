from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from services.claude_service import score_resume as score_resume_svc
from services.claude_service import skill_suggestions as skill_suggestions_svc

router = APIRouter(prefix="/analyze", tags=["analyze"])


class ResumeScoreBody(BaseModel):
    resume_text: str = ""
    job_description: str = ""


class SkillSuggestionsBody(BaseModel):
    resume_text: str = ""
    target_role: str = ""


@router.post("/resume-score")
def resume_score(body: ResumeScoreBody) -> dict[str, Any]:
    return score_resume_svc(body.resume_text, body.job_description)


@router.post("/skill-suggestions")
def skill_suggestions(body: SkillSuggestionsBody) -> dict[str, Any]:
    return skill_suggestions_svc(body.resume_text, body.target_role)
