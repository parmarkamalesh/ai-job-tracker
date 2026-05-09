export type JobStatus = 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Job {
  id: number;
  userId: number;
  title: string;
  company: string;
  status: JobStatus;
  appliedDate: string | null;
  notes: string | null;
  salary: string | null;
  url: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobStats {
  total: number;
  byStatus: Record<string, number>;
}
