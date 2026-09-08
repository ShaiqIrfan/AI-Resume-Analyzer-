"use client";

import { AnimatePresence, motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";

import ATSScore from "@/components/ATSScore";
import AnimatedNumber from "@/components/animations/AnimatedNumber";
import LoadingState from "@/components/LoadingState";
import ProfessionalSummary from "@/components/ProfessionalSummary";
import ProSubscriptionModal from "@/components/ProSubscriptionModal";
import Recommendations from "@/components/Recommendations";
import ResumeOptimizationPanel from "@/components/ResumeOptimizationPanel";
import Skills from "@/components/Skills";
import Strengths from "@/components/Strengths";
import Weaknesses from "@/components/Weaknesses";
import { DEMO_PRO_GATE_ENABLED } from "@/config/demoProGate";
import { animationDurations, animationEasings } from "@/components/animations/animationConfig";
import PageTransition from "@/components/animations/PageTransition";
import StaggerContainer from "@/components/animations/StaggerContainer";
import SlideUp from "@/components/animations/SlideUp";
import ATSScoreSkeleton from "@/components/skeletons/ATSScoreSkeleton";
import SectionSkeleton from "@/components/skeletons/SectionSkeleton";
import SkillsSkeleton from "@/components/skeletons/SkillsSkeleton";
import type { ResumeAnalyzeResponse, ResumeJobAnalysisResponse, ResumeJobOptimizeResponse, ResumeOptimizeResponse } from "@/types/analysis";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const API_BASE_URL = "http://127.0.0.1:8000";

interface ActionButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  loading?: boolean;
  arrow?: boolean;
}

interface StateCardProps {
  variant: "empty" | "error" | "success";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  ariaLive?: "polite" | "assertive";
}

function ActionButton({
  children,
  variant = "primary",
  loading = false,
  arrow = false,
  disabled,
  className = "",
  ...props
}: ActionButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  const variantClasses =
    variant === "primary"
      ? "bg-gradient-to-r from-indigo-500 via-indigo-500 to-violet-500 text-white shadow-[0_14px_28px_-18px_rgba(91,124,255,0.8)] hover:from-indigo-400 hover:to-violet-400 hover:shadow-[0_18px_30px_-18px_rgba(91,124,255,0.8)] disabled:bg-slate-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400"
      : "border border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800 hover:border-indigo-400/50 disabled:border-slate-700 disabled:bg-slate-900 disabled:text-slate-500";

  return (
    <motion.button
      {...props}
      type={props.type ?? "button"}
      disabled={disabled || loading}
      whileHover={disabled || shouldReduceMotion ? undefined : { y: -1, scale: 1.01 }}
      whileTap={disabled || shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.18, ease: animationEasings.soft }}
      className={[
        "group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:shadow-none",
        variantClasses,
        className,
      ].join(" ")}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <motion.span
          aria-hidden="true"
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [0.7, 1, 0.7], scale: [0.9, 1, 0.9] }}
          transition={{ duration: 1.2, ease: "easeInOut", repeat: shouldReduceMotion ? 0 : Infinity }}
          className="inline-flex h-2.5 w-2.5 rounded-full bg-current"
        />
      ) : null}

      <span className="inline-flex items-center gap-2">
        {children}
        {arrow && !loading ? <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span> : null}
      </span>
    </motion.button>
  );
}

function StateCard({ variant, title, description, actionLabel, onAction, ariaLive = "polite" }: StateCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const styles = {
    empty: {
      iconRing: "bg-indigo-500/10 text-indigo-200 ring-indigo-400/25",
      border: "border-indigo-500/20 bg-slate-900/75",
      icon: "📄",
    },
    error: {
      iconRing: "bg-red-500/10 text-red-200 ring-red-400/25",
      border: "border-red-500/20 bg-red-500/5",
      icon: "⚠",
    },
    success: {
      iconRing: "bg-emerald-500/10 text-emerald-200 ring-emerald-400/25",
      border: "border-emerald-500/20 bg-emerald-500/5",
      icon: "✓",
    },
  } as const;

  const theme = styles[variant];

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.32, ease: animationEasings.standard }}
      role={variant === "error" ? "alert" : "status"}
      aria-live={ariaLive}
      className={`rounded-3xl border ${theme.border} p-6 text-center shadow-[0_18px_45px_-28px_rgba(15,23,42,0.7)] sm:p-8`}
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.38, ease: animationEasings.emphasized }}
        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-sm ring-1 ${theme.iconRing}`}
      >
        {theme.icon}
      </motion.div>

      <h3 className="text-[1.9rem] font-semibold tracking-[-0.04em] text-slate-50 sm:text-[2.1rem]">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">{description}</p>

      {actionLabel && onAction ? (
        <div className="mt-5 flex justify-center">
          <ActionButton onClick={onAction} arrow className="w-full px-6 py-3 text-base font-semibold sm:w-auto">
            {actionLabel}
          </ActionButton>
        </div>
      ) : null}
    </motion.div>
  );
}

export default function UploadSection() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [analysisState, setAnalysisState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalyzeResponse | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<ResumeOptimizeResponse | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobAnalysisResult, setJobAnalysisResult] = useState<ResumeJobAnalysisResponse | null>(null);
  const [jobSpecificOptimizationResult, setJobSpecificOptimizationResult] = useState<ResumeJobOptimizeResponse | null>(null);
  const [isPreparingResults, setIsPreparingResults] = useState(false);
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [isOptimizingForJob, setIsOptimizingForJob] = useState(false);
  const [isDownloadingOptimizedResume, setIsDownloadingOptimizedResume] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [demoMessage, setDemoMessage] = useState("");
  const shouldReduceMotion = useReducedMotion();
  const isAnalyzing = analysisState === "loading" || analysisState === "success" || isPreparingResults || isAnalyzingJob;
  const successTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const handleDropzoneKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isAnalyzing) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };

  const validatePdfFile = (file: File | null) => {
    if (!file) {
      setError("Please select a PDF file.");
      return false;
    }

    const isPdfMimeType = file.type === "application/pdf";
    const isPdfExtension = file.name.toLowerCase().endsWith(".pdf");

    if (!isPdfMimeType && !isPdfExtension) {
      setError("Only PDF files are supported.");
      setSelectedFile(null);
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Please upload a PDF smaller than 10 MB.");
      setSelectedFile(null);
      return false;
    }

    setError("");
    setSelectedFile(file);
    return true;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isAnalyzing) {
      return;
    }

    const file = event.target.files?.[0] ?? null;
    validatePdfFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (isAnalyzing) {
      return;
    }

    const droppedFile = event.dataTransfer.files?.[0] ?? null;
    validatePdfFile(droppedFile);
  };

  const openFilePicker = () => {
    if (isAnalyzing) {
      return;
    }

    inputRef.current?.click();
  };

  const clearSelection = () => {
    if (isAnalyzing) {
      return;
    }

    setSelectedFile(null);
    setError("");
    setAnalysisState("idle");
    setAnalysisResult(null);
    setOptimizationResult(null);
    setJobAnalysisResult(null);
    setJobSpecificOptimizationResult(null);
    setJobDescription("");
    setIsPreparingResults(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (isAnalyzing || !selectedFile) {
      if (!selectedFile) {
        setError("Please select a PDF file.");
      }
      return;
    }

    setAnalysisState("loading");
    setIsPreparingResults(false);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/resume/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let detail = "Unable to analyze the resume. Please try again.";

        try {
          const errorBody = (await response.json()) as { detail?: string | string[] };
          if (typeof errorBody.detail === "string") {
            detail = errorBody.detail;
          } else if (Array.isArray(errorBody.detail)) {
            detail = errorBody.detail.join(" ");
          }
        } catch {
          // Ignore JSON parsing errors and fall back to the generic message.
        }

        setError(detail);
        setAnalysisState("error");
        setIsPreparingResults(false);
        return;
      }

      const data = (await response.json()) as ResumeAnalyzeResponse;
      setAnalysisResult(data);
      setAnalysisState("success");
      setIsPreparingResults(true);

      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }

      successTimerRef.current = window.setTimeout(() => {
        setAnalysisState("idle");
        setIsPreparingResults(false);
      }, 450);
    } catch {
      setError("Unable to connect to the resume analysis server. Please make sure the backend is running.");
      setAnalysisState("error");
      setIsPreparingResults(false);
    }
  };

  const openProGate = () => {
    setDemoMessage("");
    setError("");
    setIsProModalOpen(true);
  };

  const handleProSubscribe = () => {
    setDemoMessage("Pro subscription checkout coming soon.");
  };

  const closeProGate = () => {
    setIsProModalOpen(false);
    setDemoMessage("");
  };

  const handleJobAnalysis = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first.");
      return;
    }

    const trimmedJobDescription = jobDescription.trim();
    if (trimmedJobDescription.length < 20) {
      setError("Please provide a realistic job description with at least 20 characters so the role fit review can compare it to your resume.");
      return;
    }

    if (DEMO_PRO_GATE_ENABLED) {
      openProGate();
      return;
    }

    setIsAnalyzingJob(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("job_description", trimmedJobDescription);

    try {
      const response = await fetch(`${API_BASE_URL}/resume/analyze-job`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let detail = "Unable to analyze the resume against this job description.";

        try {
          const errorBody = (await response.json()) as { detail?: string | string[] };
          if (typeof errorBody.detail === "string") {
            detail = errorBody.detail;
          } else if (Array.isArray(errorBody.detail)) {
            detail = errorBody.detail.join(" ");
          }
        } catch {
          // Ignore JSON parsing errors and use the fallback message.
        }

        setError(detail);
        setIsAnalyzingJob(false);
        return;
      }

      const data = (await response.json()) as ResumeJobAnalysisResponse;
      setJobAnalysisResult(data);
      setIsAnalyzingJob(false);
    } catch {
      setError("Unable to connect to the job-fit analysis server. Please make sure the backend is running.");
      setIsAnalyzingJob(false);
    }
  };

  const handleJobSpecificOptimization = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first.");
      return;
    }

    const trimmedJobDescription = jobDescription.trim();
    if (trimmedJobDescription.length < 20) {
      setError("Please provide a realistic job description before optimizing for this role.");
      return;
    }

    if (DEMO_PRO_GATE_ENABLED) {
      openProGate();
      return;
    }

    setIsOptimizingForJob(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("job_description", trimmedJobDescription);

    try {
      const response = await fetch(`${API_BASE_URL}/resume/optimize-for-job`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let detail = "Unable to optimize the resume for this role.";

        try {
          const errorBody = (await response.json()) as { detail?: string | string[] };
          if (typeof errorBody.detail === "string") {
            detail = errorBody.detail;
          } else if (Array.isArray(errorBody.detail)) {
            detail = errorBody.detail.join(" ");
          }
        } catch {
          // Ignore JSON parsing errors and use the fallback message.
        }

        setError(detail);
        setIsOptimizingForJob(false);
        return;
      }

      const data = (await response.json()) as ResumeJobOptimizeResponse;
      setJobSpecificOptimizationResult(data);
      setIsOptimizingForJob(false);
    } catch {
      setError("Unable to connect to the job-specific optimization server. Please make sure the backend is running.");
      setIsOptimizingForJob(false);
    }
  };

  const handleDownloadOptimizedResume = async () => {
    const currentOptimization = jobSpecificOptimizationResult ?? optimizationResult;

    if (!currentOptimization) {
      setError("Please generate an optimization result before downloading your resume.");
      return;
    }

    if (DEMO_PRO_GATE_ENABLED) {
      openProGate();
      return;
    }

    setIsDownloadingOptimizedResume(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/resume/download-optimized`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: selectedFile?.name ?? "resume.pdf",
          target_role: jobSpecificOptimizationResult?.target_role ?? "",
          optimization: currentOptimization.optimization,
        }),
      });

      if (!response.ok) {
        let detail = "Unable to generate the optimized resume download.";

        try {
          const errorBody = (await response.json()) as { detail?: string | string[] };
          if (typeof errorBody.detail === "string") {
            detail = errorBody.detail;
          } else if (Array.isArray(errorBody.detail)) {
            detail = errorBody.detail.join(" ");
          }
        } catch {
          // Ignore JSON parsing errors and keep the fallback message.
        }

        setError(detail);
        setIsDownloadingOptimizedResume(false);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const rawFileName = response.headers.get("content-disposition")?.match(/filename="?([^";]+)"?/)?.[1] ?? "optimized_resume.pdf";
      const fileName = rawFileName.toLowerCase().endsWith(".pdf") ? rawFileName : `${rawFileName.replace(/\.[^/.]+$/, "") || "optimized_resume"}.pdf`;

      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setIsDownloadingOptimizedResume(false);
    } catch {
      setError("Unable to download the optimized resume. Please try again.");
      setIsDownloadingOptimizedResume(false);
    }
  };

  const shouldShowEmptyState = !selectedFile && !analysisResult && analysisState === "idle" && !error;
  const shouldShowSuccessState = analysisResult && analysisState === "success" && !isPreparingResults;
  const shouldShowErrorState = analysisState === "error" && Boolean(error);
  const shouldShowSkeletons = Boolean(analysisResult) && isPreparingResults;
  const disableAnalysisButton = !selectedFile || isAnalyzing;
  const activeOptimization = jobSpecificOptimizationResult ?? optimizationResult;

  return (
    <PageTransition className="space-y-6 sm:space-y-8">
      <section className="glass-panel w-full min-w-0 rounded-3xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-[0_18px_48px_-24px_rgba(15,23,42,0.72)] sm:p-8 lg:p-9">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-xl text-indigo-200 ring-1 ring-indigo-400/20">
            📄
          </div>
          <div className="space-y-1">
            <h2 className="text-[1.75rem] font-semibold tracking-[-0.04em] text-slate-50 sm:text-2xl">
              Upload your resume
            </h2>
            <p className="text-sm leading-6 text-slate-300">Drag and drop your PDF here, or choose a file</p>
          </div>
        </div>

        <motion.div
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : animationDurations.fast, ease: animationEasings.soft }}
          role="button"
          tabIndex={isAnalyzing ? -1 : 0}
          aria-label={selectedFile ? `Upload a different PDF file. Selected file: ${selectedFile.name}` : "Upload resume PDF"}
          aria-describedby="resume-upload-hint"
          aria-disabled={isAnalyzing}
          className={[
            "mt-6 w-full min-w-0 rounded-3xl border-2 border-dashed bg-slate-950/25 p-6 transition-all duration-200 backdrop-blur-[2px] outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:p-8",
            isDragging
              ? "border-indigo-400 bg-indigo-500/10 shadow-[0_18px_45px_-24px_rgba(99,102,241,0.9)]"
              : selectedFile
                ? "border-emerald-400/50 bg-emerald-500/10 shadow-[0_16px_35px_-24px_rgba(52,211,153,0.42)]"
                : "border-slate-700 hover:border-indigo-400/50 hover:bg-slate-900/60 hover:shadow-[0_18px_40px_-28px_rgba(99,102,241,0.65)]",
          ].join(" ")}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          onKeyDown={handleDropzoneKeyDown}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: animationDurations.normal, ease: animationEasings.standard }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl text-slate-100 shadow-sm ring-1 ring-slate-700"
            >
              {selectedFile ? "✓" : "📎"}
            </motion.div>

            <div className="mt-4">
              {selectedFile ? (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : animationDurations.normal, ease: animationEasings.standard }}
                  className="w-full min-w-0 space-y-2"
                  aria-live="polite"
                >
                  <p className="max-w-full break-all text-lg font-semibold text-emerald-300">{selectedFile.name}</p>
                  <p className="text-sm text-slate-300">PDF Resume</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: animationDurations.normal, ease: animationEasings.standard }}
                  className="space-y-2"
                >
                  <p className="text-lg font-semibold text-slate-100">
                    {isDragging ? "Drop your resume here" : "Upload your resume"}
                  </p>
                  <p className="text-sm text-slate-400">Drag & drop your PDF here or browse from your device</p>
                </motion.div>
              )}
            </div>

            <div className="mt-5 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
              <ActionButton onClick={openFilePicker} disabled={isAnalyzing} arrow className="w-full sm:w-auto">
                Browse Files
              </ActionButton>

              {selectedFile ? (
                <ActionButton variant="secondary" onClick={clearSelection} disabled={isAnalyzing} className="w-full sm:w-auto">
                  Remove
                </ActionButton>
              ) : null}
            </div>

            <p id="resume-upload-hint" className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              PDF • Max 10MB
            </p>

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={isAnalyzing}
              className="sr-only"
              aria-label="Upload resume PDF"
            />
          </div>
        </motion.div>

      </section>

      <ProSubscriptionModal
        isOpen={isProModalOpen}
        onClose={closeProGate}
        onSubscribe={handleProSubscribe}
        demoMessage={demoMessage}
      />

      <AnimatePresence mode="wait">
        {shouldShowEmptyState ? (
          <motion.div key="empty-state" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: animationEasings.standard }}>
            <StateCard
              variant="empty"
              title="No Resume Analyzed"
              description="Upload your resume to begin your ATS and AI analysis."
              actionLabel="Upload Resume"
              onAction={openFilePicker}
            />
          </motion.div>
        ) : null}

        {shouldShowErrorState ? (
          <motion.div key="error-state" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: animationEasings.standard }}>
            <StateCard
              variant="error"
              title="Something went wrong"
              description={error || "We couldn't analyze this resume. Please try again."}
              actionLabel="Try Again"
              onAction={openFilePicker}
              ariaLive="assertive"
            />
          </motion.div>
        ) : null}
        {analysisState === "loading" ? (
          <motion.div
            key="loading"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: animationEasings.standard }}
            className="mt-6"
          >
            <LoadingState status="loading" />
          </motion.div>
        ) : null}

        {shouldShowSuccessState ? (
          <motion.div
            key="success"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: animationEasings.standard }}
            className="mt-6"
          >
            <StateCard
              variant="success"
              title="Analysis Complete"
              description="Your resume has been successfully analyzed."
              ariaLive="polite"
            />
          </motion.div>
        ) : null}

        {shouldShowSkeletons ? (
          <motion.div
            key="skeletons"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: animationEasings.standard }}
            className="mt-6 space-y-6"
          >
            <ATSScoreSkeleton />
            <SectionSkeleton title="Professional Summary" lines={4} />
            <SkillsSkeleton />
            <SectionSkeleton title="Strengths" lines={4} />
            <SectionSkeleton title="Weaknesses" lines={3} />
            <SectionSkeleton title="Recommendations" lines={5} />
          </motion.div>
        ) : null}

        {analysisResult && analysisState === "idle" ? (
          <motion.div
            key="results"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: animationEasings.emphasized }}
            className="mt-6"
          >
            <StaggerContainer className="space-y-6" delay={0.06} stagger={0.08}>
              <SlideUp duration={0.45} delay={0.06}>
                <ATSScore ats={analysisResult.analysis.ats} />
              </SlideUp>
              <SlideUp duration={0.45} delay={0.14}>
                <ProfessionalSummary summary={analysisResult.analysis.professional_summary} />
              </SlideUp>
              <SlideUp duration={0.45} delay={0.22}>
                <Skills items={analysisResult.analysis.skills} title="Skills" />
              </SlideUp>
              <SlideUp duration={0.45} delay={0.3}>
                <Strengths items={analysisResult.analysis.strengths} title="✓ Strengths" />
              </SlideUp>
              <SlideUp duration={0.45} delay={0.38}>
                <Weaknesses items={analysisResult.analysis.weaknesses} title="⚠ Weaknesses" />
              </SlideUp>
              <SlideUp duration={0.45} delay={0.46}>
                <Recommendations items={analysisResult.analysis.recommendations} title="Recommendations" />
              </SlideUp>
            </StaggerContainer>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {analysisResult && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm text-indigo-100 shadow-[0_18px_30px_-24px_rgba(99,102,241,0.8)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-indigo-200">AI Resume Optimization</p>
                <p className="text-indigo-100/80">Improve the wording without changing the underlying facts.</p>
              </div>
              <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-emerald-200">
                Use role-specific optimization below
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-50">Job Description Match</p>
                <p className="text-sm text-slate-300">Get a role-based fit review while keeping the ATS score authoritative.</p>
              </div>
            </div>

            <label htmlFor="job-description" className="mb-2 block text-sm font-medium text-slate-200">
              Paste the target job description
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              rows={8}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="We are looking for a senior backend engineer with Python, FastAPI, SQL, APIs, and stakeholder communication experience..."
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <ActionButton
                onClick={handleJobAnalysis}
                disabled={isAnalyzingJob || !selectedFile || !jobDescription.trim()}
                loading={isAnalyzingJob}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                {isAnalyzingJob ? "Reviewing Fit..." : "Analyze for This Role"}
              </ActionButton>

              <ActionButton
                onClick={handleJobSpecificOptimization}
                disabled={isOptimizingForJob || !selectedFile || !jobDescription.trim()}
                loading={isOptimizingForJob}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                {isOptimizingForJob ? "Optimizing..." : "Optimize Resume for This Job"}
              </ActionButton>
            </div>
          </div>
        </div>
      )}

      {jobSpecificOptimizationResult && (
        <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-emerald-200/80">Job-Specific Optimization</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-50">{jobSpecificOptimizationResult.target_role}</h3>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-100">
              ATS remains authoritative
            </span>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-200">Professional Summary</p>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Original</p>
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-300">{jobSpecificOptimizationResult.optimization.professional_summary.original}</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-emerald-300">Optimized</p>
                  <p className="whitespace-pre-line text-sm leading-7 text-emerald-100">{jobSpecificOptimizationResult.optimization.professional_summary.optimized}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-200">Experience</p>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Original</p>
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-300">{jobSpecificOptimizationResult.optimization.experience.original}</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-emerald-300">Optimized</p>
                  <p className="whitespace-pre-line text-sm leading-7 text-emerald-100">{jobSpecificOptimizationResult.optimization.experience.optimized}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-200">Skills</p>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Original</p>
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-300">{jobSpecificOptimizationResult.optimization.skills.original}</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-emerald-300">Optimized</p>
                  <p className="whitespace-pre-line text-sm leading-7 text-emerald-100">{jobSpecificOptimizationResult.optimization.skills.optimized}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-200">Bullet Points</p>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Original</p>
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-300">{jobSpecificOptimizationResult.optimization.bullet_points.original}</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-emerald-300">Optimized</p>
                  <p className="whitespace-pre-line text-sm leading-7 text-emerald-100">{jobSpecificOptimizationResult.optimization.bullet_points.optimized}</p>
                </div>
              </div>
            </div>
          </div>

          {jobSpecificOptimizationResult.optimization.optimization_notes.length > 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Optimization notes</p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-200">
                {jobSpecificOptimizationResult.optimization.optimization_notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      {jobAnalysisResult && (
        <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-violet-200/80">Role Fit Review</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-50">{jobAnalysisResult.analysis.job_title}</h3>
            </div>
            <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-100">
              ATS remains authoritative
            </span>
          </div>

          <div className="mb-6 rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-500/12 to-indigo-500/12 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200">Job Match Score</p>
                <div className="mt-3 flex items-end gap-2">
                  <AnimatedNumber
                    value={Math.min(Math.max(jobAnalysisResult.analysis.job_match_score ?? 0, 0), 100)}
                    className="text-4xl font-bold tracking-[-0.05em] text-slate-50 sm:text-5xl"
                  />
                  <span className="pb-1 text-lg font-medium text-slate-300 sm:text-xl">%</span>
                </div>
              </div>
              <span className="inline-flex rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-violet-100">
                {jobAnalysisResult.analysis.job_match_score >= 80
                  ? "Strong Match"
                  : jobAnalysisResult.analysis.job_match_score >= 60
                    ? "Good Match"
                    : jobAnalysisResult.analysis.job_match_score >= 40
                      ? "Moderate Match"
                      : "Low Match"}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-200">{jobAnalysisResult.analysis.score_explanation}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-200">Matching Skills</p>
              <ul className="space-y-2 text-sm text-slate-200">
                {jobAnalysisResult.analysis.matching_skills.length > 0 ? (
                  jobAnalysisResult.analysis.matching_skills.map((skill) => <li key={skill}>• {skill}</li>)
                ) : (
                  <li>• No clear skill overlap was identified from the resume.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-amber-200">Gaps / Weak Matches</p>
              <ul className="space-y-2 text-sm text-slate-200">
                {jobAnalysisResult.analysis.missing_or_weak_requirements.length > 0 ? (
                  jobAnalysisResult.analysis.missing_or_weak_requirements.map((item) => <li key={item}>• {item}</li>)
                ) : (
                  <li>• No major gaps were identified from the provided job description.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-200">Matching Keywords</p>
              <ul className="space-y-2 text-sm text-slate-200">
                {jobAnalysisResult.analysis.matching_keywords.length > 0 ? (
                  jobAnalysisResult.analysis.matching_keywords.map((item) => <li key={item}>• {item}</li>)
                ) : (
                  <li>• No important matching keywords were identified in the resume.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Relevant Experience</p>
              <ul className="space-y-2 text-sm text-slate-200">
                {jobAnalysisResult.analysis.relevant_experience.length > 0 ? (
                  jobAnalysisResult.analysis.relevant_experience.map((item) => <li key={item}>• {item}</li>)
                ) : (
                  <li>• No directly relevant experience was clearly identified.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-200">Keyword Alignment</p>
              <ul className="space-y-2 text-sm text-slate-200">
                {jobAnalysisResult.analysis.keyword_alignment.length > 0 ? (
                  jobAnalysisResult.analysis.keyword_alignment.map((item) => <li key={item}>• {item}</li>)
                ) : (
                  <li>• Keyword alignment details were not available.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Experience Alignment</p>
              <p className="text-sm leading-7 text-slate-200">{jobAnalysisResult.analysis.experience_alignment}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-sky-200">Resume Strengths for This Role</p>
              <ul className="space-y-2 text-sm text-slate-200">
                {jobAnalysisResult.analysis.resume_strengths.length > 0 ? (
                  jobAnalysisResult.analysis.resume_strengths.map((item) => <li key={item}>• {item}</li>)
                ) : (
                  <li>• No specific strengths were identified for the requested role.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-amber-200">Missing Requirements</p>
              <ul className="space-y-2 text-sm text-slate-200">
                {jobAnalysisResult.analysis.missing_requirements.length > 0 ? (
                  jobAnalysisResult.analysis.missing_requirements.map((item) => <li key={item}>• {item}</li>)
                ) : (
                  <li>• No important missing requirements were identified.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-pink-200">Improvement Suggestions</p>
              <ul className="space-y-2 text-sm text-slate-200">
                {jobAnalysisResult.analysis.improvement_suggestions.length > 0 ? (
                  jobAnalysisResult.analysis.improvement_suggestions.map((item) => <li key={item}>• {item}</li>)
                ) : (
                  <li>• No suggestions were provided for this role.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-violet-200">Overall Fit</p>
              <p className="text-sm leading-7 text-slate-200">{jobAnalysisResult.analysis.overall_fit}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-amber-200">Missing Keywords</p>
              <ul className="space-y-2 text-sm text-slate-200">
                {jobAnalysisResult.analysis.missing_keywords.length > 0 ? (
                  jobAnalysisResult.analysis.missing_keywords.map((item) => <li key={item}>• {item}</li>)
                ) : (
                  <li>• No significant missing keywords identified.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-rose-200">Missing Skills</p>
              <ul className="space-y-2 text-sm text-slate-200">
                {jobAnalysisResult.analysis.missing_skills.length > 0 ? (
                  jobAnalysisResult.analysis.missing_skills.map((item) => <li key={item}>• {item}</li>)
                ) : (
                  <li>• No significant missing skills identified.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeOptimization && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-end">
            <ActionButton
              onClick={handleDownloadOptimizedResume}
              disabled={isDownloadingOptimizedResume}
              loading={isDownloadingOptimizedResume}
              variant="secondary"
              className="w-full px-6 py-3 text-base font-semibold sm:w-auto"
            >
              {isDownloadingOptimizedResume ? "Generating Resume..." : "Download Optimized Resume"}
            </ActionButton>
          </div>

          <ResumeOptimizationPanel optimization={activeOptimization.optimization} />
        </div>
      )}

      <div className="mt-6 flex w-full items-center justify-end">
        <ActionButton
          onClick={handleAnalyze}
          disabled={disableAnalysisButton}
          loading={isAnalyzing}
          arrow={!isAnalyzing}
          className="w-full px-6 py-3 text-base font-semibold sm:w-auto"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
        </ActionButton>
      </div>
    </PageTransition>
  );
}
