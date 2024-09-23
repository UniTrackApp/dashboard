import { prisma } from '~/server/prisma'

import { Separator } from '~/components/ui/separator'
import { columns } from './columns'
import { DataTable } from './data-table'

export default async function Records() {
  // Fetch students info from database
  const data = await prisma.lecture.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="flex flex-col justify-center">
      <div>
        {/* Title - Title and description on the page */}
        <h1 className="text-2xl font-bold text-foreground">Lectures</h1>
        <p className="mt-1 text-muted-foreground">
          Manage all lectures here. Lectures will always belong to a module and
          will need to be enrolled to students.
        </p>
        <Separator className="mt-4 mb-1" />
      </div>

      {/* Card - Contains table and button to add new students */}
      <div>
        {/* Table - To display Attendance Records */}
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
