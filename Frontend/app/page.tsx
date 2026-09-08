import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import UploadSection from "@/components/UploadSection";

export default function Home() {
  return (
    <main className="min-h-screen w-full px-3 py-6 sm:px-6 lg:px-8">
      <PageTransition className="mx-auto w-full max-w-6xl pt-2 sm:pt-6 lg:pt-8">
        <FadeIn duration={0.45} delay={0.05} className="mb-8 text-center sm:mb-12">
          <header className="space-y-3 sm:space-y-4">
            <div className="glass-panel inline-flex items-center rounded-full border border-indigo-400/25 bg-slate-900/65 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-200 shadow-[0_12px_30px_-22px_rgba(91,124,255,0.75)] sm:text-[11px]">
              AI Resume Analyzer
            </div>
            <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-[-0.05em] text-slate-50 sm:text-4xl lg:text-5xl">
              Analyze your resume with AI + ATS
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Upload a resume, review the ATS score, and read the AI-generated analysis in one streamlined dashboard.
            </p>
          </header>
        </FadeIn>

        <div className="space-y-6 sm:space-y-8">
          <UploadSection />
        </div>
      </PageTransition>
    </main>
  );
}
