import Skeleton from "@/components/skeletons/Skeleton";

interface SectionSkeletonProps {
  title?: string;
  lines?: number;
  className?: string;
}

export default function SectionSkeleton({ title, lines = 3, className = "" }: SectionSkeletonProps) {
  return (
    <section className={[
      "rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm sm:p-7",
      className,
    ].join(" ")}>
      {title ? <Skeleton className="h-6 w-32" rounded="rounded-xl" /> : null}
      <div className="mt-4 space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            className={[
              "h-4 w-full",
              index === lines - 1 ? "w-4/5" : "",
            ].join(" ")}
            rounded="rounded-full"
          />
        ))}
      </div>
    </section>
  );
}
