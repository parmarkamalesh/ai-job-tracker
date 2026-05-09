import { Response } from 'express';
import { Job, JobStatus } from '../models/jobModel';
import { AuthRequest } from '../types/auth';
import { HttpError } from '../middleware/errorHandler';

const ALLOWED_STATUS: JobStatus[] = ['applied', 'interviewing', 'offer', 'rejected'];

function assertOwner(job: Job, userId: number): void {
  if (job.userId !== userId) throw new HttpError(403, 'Forbidden');
}

export async function listJobs(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const jobs = await Job.findAll({
    where: { userId },
    order: [['appliedDate', 'DESC'], ['createdAt', 'DESC']],
  });
  res.json({ jobs });
}

function parseId(param: string | string[] | undefined): number | null {
  const raw = Array.isArray(param) ? param[0] : param;
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function getJob(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  const job = await Job.findByPk(id);
  if (!job) {
    res.status(404).json({ message: 'Job not found' });
    return;
  }
  assertOwner(job, userId);
  res.json({ job });
}

export async function createJob(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const body = req.body as Partial<Job>;

  const title = (body.title ?? '').trim();
  const company = (body.company ?? '').trim();
  if (!title || !company) {
    res.status(400).json({ message: 'Title and company are required' });
    return;
  }

  const status = (body.status as JobStatus) ?? 'applied';
  if (!ALLOWED_STATUS.includes(status)) {
    res.status(400).json({ message: 'Invalid status' });
    return;
  }

  const job = await Job.create({
    userId,
    title,
    company,
    status,
    appliedDate: body.appliedDate ?? null,
    notes: body.notes ?? null,
    salary: body.salary ?? null,
    url: body.url ?? null,
  });

  res.status(201).json({ job });
}

export async function updateJob(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  const job = await Job.findByPk(id);
  if (!job) {
    res.status(404).json({ message: 'Job not found' });
    return;
  }
  assertOwner(job, userId);

  const body = req.body as Partial<Job>;
  if (body.status && !ALLOWED_STATUS.includes(body.status as JobStatus)) {
    res.status(400).json({ message: 'Invalid status' });
    return;
  }

  await job.update({
    ...(body.title !== undefined && { title: body.title }),
    ...(body.company !== undefined && { company: body.company }),
    ...(body.status !== undefined && { status: body.status as JobStatus }),
    ...(body.appliedDate !== undefined && { appliedDate: body.appliedDate }),
    ...(body.notes !== undefined && { notes: body.notes }),
    ...(body.salary !== undefined && { salary: body.salary }),
    ...(body.url !== undefined && { url: body.url }),
  });

  res.json({ job });
}

export async function deleteJob(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  const job = await Job.findByPk(id);
  if (!job) {
    res.status(404).json({ message: 'Job not found' });
    return;
  }
  assertOwner(job, userId);
  await job.destroy();
  res.status(204).send();
}

export async function stats(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const jobs = await Job.findAll({ where: { userId }, attributes: ['status'] });

  const byStatus: Record<string, number> = {};
  for (const s of ALLOWED_STATUS) byStatus[s] = 0;
  for (const j of jobs) {
    byStatus[j.status] = (byStatus[j.status] ?? 0) + 1;
  }

  res.json({
    total: jobs.length,
    byStatus,
  });
}
