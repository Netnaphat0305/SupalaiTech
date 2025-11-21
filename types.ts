export enum CandidateStatus {
  RECEIVED = 'RECEIVED',
  AI_SCREENING = 'AI_SCREENING',
  DEPARTMENT_REVIEW = 'DEPARTMENT_REVIEW',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED'
}

export interface DetailedScore {
  technical: number;
  experience: number;
  softSkills: number;
  education: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string; // New field for filtering
  resumeText: string;
  aiScore: number; // Overall 0-100
  detailedScore?: DetailedScore; // New detailed breakdown
  status: CandidateStatus;
  summary?: string;
  skills?: string[];
  appliedDate: string;
  // HR Workflow Fields
  interviewDate?: string; 
  interviewReport?: string;
  isFinalized?: boolean; // True when saved to DB
}

export interface JobPost {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  status: 'DRAFT' | 'PUBLISHED';
  platforms: string[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  source: 'SELENIUM' | 'LANGCHAIN' | 'OLLAMA' | 'SYSTEM';
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  JOB_CREATOR = 'JOB_CREATOR',
  CANDIDATE_PIPELINE = 'CANDIDATE_PIPELINE',
}