import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface ProSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  demoMessage?: string;
}

export default function ProSubscriptionModal({
  isOpen,
  onClose,
  onSubscribe,
  demoMessage,
}: ProSubscriptionModalProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          aria-labelledby="pro-subscription-title"
        >
          <motion.div
            initial={shouldReduceMotion ? { scale: 1, y: 0 } : { scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { scale: 1, y: 0 } : { scale: 0.97, y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-violet-500/25 bg-slate-900 shadow-[0_28px_80px_-30px_rgba(76,29,149,0.8)]"
          >
            <div className="border-b border-slate-700/80 bg-gradient-to-r from-violet-500/15 via-indigo-500/10 to-slate-900 px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/80">PRO</p>
                  <h2 id="pro-subscription-title" className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-50">
                    Unlock Resume Pro
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close subscription modal"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950/60 text-lg text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-6"> 
              <p className="text-sm leading-7 text-slate-300">
                Get more from your resume with AI-powered tools.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                <li className="flex items-start gap-2">✓ <span>Job Description Matching</span></li>
                <li className="flex items-start gap-2">✓ <span>Job Match Score</span></li>
                <li className="flex items-start gap-2">✓ <span>Missing Keywords &amp; Skills</span></li>
                <li className="flex items-start gap-2">✓ <span>Role-Specific Resume Optimization</span></li>
                <li className="flex items-start gap-2">✓ <span>Before / After Comparison</span></li>
                <li className="flex items-start gap-2">✓ <span>Optimized Resume PDF Download</span></li>
              </ul>

              <div className="mt-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-center">
                <p className="text-3xl font-bold tracking-[-0.05em] text-white">$5 <span className="text-base font-medium text-violet-100">/ month</span></p>
              </div>

              {demoMessage ? (
                <div className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                  {demoMessage}
                </div>
              ) : null}

              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={onSubscribe}
                  className="w-full rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-18px_rgba(91,124,255,0.8)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Subscribe for $5/month
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
