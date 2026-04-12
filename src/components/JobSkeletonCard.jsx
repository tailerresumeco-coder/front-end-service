export default function JobSkeletonCard() {
  return (
    <div className="bg-surface-dark-light border border-border-primary rounded-card p-5 animate-pulse">
      {/* Top row: source badge + save icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 w-16 bg-surface-dark rounded-button" />
        <div className="h-5 w-5 bg-surface-dark rounded-full" />
      </div>

      {/* Title */}
      <div className="h-5 w-3/4 bg-surface-dark rounded mb-2" />
      <div className="h-4 w-1/2 bg-surface-dark rounded mb-4" />

      {/* Badges row */}
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-20 bg-surface-dark rounded-button" />
        <div className="h-5 w-16 bg-surface-dark rounded-button" />
      </div>

      {/* Location + date */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 bg-surface-dark rounded" />
        <div className="h-4 w-16 bg-surface-dark rounded" />
      </div>

      {/* Button */}
      <div className="h-9 w-full bg-surface-dark rounded-button mt-4" />
    </div>
  );
}
