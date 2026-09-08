export interface ATSAnalysis {
  score: number;
  keyword_score: number;
  structure_score: number;
  completeness_score: number;
  skills_score: number;
  readability_score: number;
  issues: string[];
}

export type AtsScore = ATSAnalysis;

export interface ResumeAnalysis {
  professional_summary: string;
  strengths: string[];
  weaknesses: string[];
  skills: string[];
  recommendations: string[];
  ats: ATSAnalysis;
}

export interface ResumeOptimizationSection {
  original: string;
  optimized: string;
  notes: string[];
}

export interface BeforeAfterComparisonItem {
  section: string;
  original_text: string;
  optimized_text: string;
  reason_for_change?: string;
}

export interface ResumeOptimization {
  professional_summary: ResumeOptimizationSection;
  experience: ResumeOptimizationSection;
  skills: ResumeOptimizationSection;
  bullet_points: ResumeOptimizationSection;
  optimization_notes: string[];
  before_after_comparison: BeforeAfterComparisonItem[];
  ats_score_remains_authoritative: boolean;
}

export interface JobSpecificAnalysis {
  job_title: string;
  matching_skills: string[];
  matching_keywords: string[];
  missing_or_weak_requirements: string[];
  missing_requirements: string[];
  missing_keywords: string[];
  missing_skills: string[];
  keyword_alignment: string[];
  relevant_experience: string[];
  experience_alignment: string;
  resume_strengths: string[];
  improvement_suggestions: string[];
  overall_fit: string;
  score_explanation: string;
  job_match_score: number;
  ats_score_remains_authoritative: boolean;
}

export interface ResumeAnalyzeResponse {
  filename: string;
  analysis: ResumeAnalysis;
}

export interface ResumeOptimizeResponse {
  filename: string;
  optimization: ResumeOptimization;
}

export interface ResumeJobAnalysisResponse {
  filename: string;
  analysis: JobSpecificAnalysis;
}

export interface ResumeJobOptimizeResponse {
  filename: string;
  target_role: string;
  optimization: ResumeOptimization;
}

export type ResumeAnalysisResponse = ResumeAnalyzeResponse;
