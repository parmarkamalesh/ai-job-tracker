import axios from 'axios';
import { Response } from 'express';
import { AuthRequest } from '../types/auth';

const AI_BASE = process.env.AI_SERVICE_URL ?? 'http://localhost:8000';

export async function scoreResume(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { resumeText, jobDescription } = req.body as {
      resumeText?: string;
      jobDescription?: string;
    };

    const { data } = await axios.post(
      `${AI_BASE}/analyze/resume-score`,
      { resume_text: resumeText ?? '', job_description: jobDescription ?? '' },
      { timeout: 60_000 }
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: 'AI service unavailable', detail: axios.isAxiosError(err) ? err.message : String(err) });
  }
}

export async function skillSuggestions(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { resumeText, targetRole } = req.body as { resumeText?: string; targetRole?: string };

    const { data } = await axios.post(
      `${AI_BASE}/analyze/skill-suggestions`,
      { resume_text: resumeText ?? '', target_role: targetRole ?? '' },
      { timeout: 60_000 }
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: 'AI service unavailable', detail: axios.isAxiosError(err) ? err.message : String(err) });
  }
}
