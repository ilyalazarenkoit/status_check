export default function CalendarLoading() {
  // Deterministic pattern: which cells show 1 or 2 event skeletons
  const eventPattern: Record<number, number> = { 1: 1, 2: 1, 3: 2, 10: 1, 17: 1, 18: 1, 29: 1, 30: 1, 32: 1 }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* FiltersBar skeleton */}
      <div className="h-14 border-b border-border px-6 flex items-center gap-3 flex-shrink-0">
        <div className="h-9 w-36 rounded-md bg-muted animate-pulse" />
        <div className="h-9 w-36 rounded-md bg-muted animate-pulse" />
      </div>

      {/* Calendar skeleton */}
      <div className="p-4 sm:p-6 flex-1">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-muted animate-pulse" />
            <div className="h-8 w-8 rounded bg-muted animate-pulse" />
            <div className="h-8 w-14 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-6 w-36 rounded bg-muted animate-pulse" />
          <div className="flex gap-1">
            <div className="h-8 w-16 rounded bg-muted animate-pulse" />
            <div className="h-8 w-14 rounded bg-muted animate-pulse" />
          </div>
        </div>

        {/* Grid */}
        <div className="border border-border rounded-md overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
              <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {Array.from({ length: 5 }).map((_, week) => (
            <div key={week} className="grid grid-cols-7 border-b border-border last:border-b-0">
              {Array.from({ length: 7 }).map((_, day) => {
                const idx = week * 7 + day
                const events = eventPattern[idx] ?? 0
                return (
                  <div key={day} className="min-h-[100px] p-1.5 border-r border-border last:border-r-0">
                    <div className="h-4 w-4 rounded bg-muted/40 animate-pulse mb-1.5 ml-auto" />
                    {events >= 1 && <div className="h-5 rounded-md bg-muted animate-pulse mb-0.5" />}
                    {events >= 2 && <div className="h-5 rounded-md bg-muted/60 animate-pulse" />}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
