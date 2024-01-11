import { Suspense } from 'react'
import QuickStatsCards from '~/components/quick-stats-cards'

import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'

export default function Dashboard() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {/* NOTE: Disabling authentication for now */}
          👋 Welcome
        </h1>
        <p className="mt-1 text-muted-foreground">
          This is your dashboard. You can get an overview of all UniTrack data
          here.
        </p>
        <Separator className="my-6" />
      </div>
      <p className="text-2xl font-semibold">Quick Stats</p>
      <Suspense fallback={<CardsSkeleton />}>
        <QuickStatsCards />
      </Suspense>
    </div>
  )
}

function CardsSkeleton() {
  return (
    <div className="mt-4 w-full h-28">
      <div className="flex gap-4 h-full">
        <Skeleton className="flex-1 h-full" />
        <Skeleton className="flex-1 h-full" />
        <Skeleton className="flex-1 h-full" />
        <Skeleton className="flex-1 h-full" />
      </div>
    </div>
  )
}
