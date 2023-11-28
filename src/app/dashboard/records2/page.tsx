import { prisma } from '~/server/prisma'

import { Separator } from '~/components/ui/separator'
import { columns } from './columns'
import { DataTable } from './data-table'

export default async function Records() {
  const data = await prisma.attendanceRecord.findMany()

  return (
    <div className="flex flex-col justify-center">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Attendance Records
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage attendance records for your students here. Including adding new
          records, and deleting existing ones.
        </p>
        <Separator className="my-6" />
      </div>

      {/* Card - Contains table and button to add new students */}
      <div>
        {/* Table - to display Attendance Records */}
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
