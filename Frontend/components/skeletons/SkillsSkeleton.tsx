import Skeleton from "@/components/skeletons/Skeleton";

export default function SkillsSkeleton() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm sm:p-7">
      <Skeleton className="h-6 w-24" rounded="rounded-xl" />
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton
            key={index}
            className={[
              "h-8",
              index % 2 === 0 ? "w-20" : index % 3 === 0 ? "w-24" : "w-16",
            ].join(" ")}
            rounded="rounded-full"
          />
        ))}
      </div>
    </section>
  );
}
