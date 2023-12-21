'use client'

import { Separator } from '~/components/ui/separator'
import { api } from '~/lib/api'

import { columns } from './columns'
import { DataTable } from './data-table'

export default function Modules() {
  // Fetch module info from database
  const { data, isLoading } = api.module.getAllModules.useQuery()

  return (
    <div className="flex flex-col justify-center">
      <div>
        {/* Title - Title and description on the page */}
        <h1 className="text-2xl font-bold text-foreground">Modules</h1>
        <p className="mt-1 text-muted-foreground">
          Manage all modules here. A module can have multiple lectures.
        </p>
        <Separator className="mt-4 mb-1" />
      </div>

      {/* Card - Contains table and button to add new modules */}
      <div>
        {/* Table - To display Attendance Records */}
        {isLoading && <p>Loading...</p>}
        {data && <DataTable columns={columns} data={data} />}
      </div>
    </div>
  )
}
