import Skeleton from "@/components/skeletons/Skeleton";

export default function ATSScoreSkeleton() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm sm:p-8">
      <Skeleton className="h-4 w-24" rounded="rounded-full" />
      <Skeleton className="mt-4 h-8 w-32" rounded="rounded-xl" />

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <Skeleton className="h-6 w-28" rounded="rounded-full" />
        <Skeleton className="mt-4 h-14 w-40" rounded="rounded-xl" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-28" rounded="rounded-full" />
              <Skeleton className="h-4 w-16" rounded="rounded-full" />
            </div>
            <Skeleton className="mt-4 h-2.5 w-full" rounded="rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
