export default function BookCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="h-56 w-full bg-gray-200" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-3 w-1/3 rounded bg-gray-200" />
        <div className="mt-2 h-8 w-full rounded bg-gray-200" />
      </div>
    </div>
  );
}
