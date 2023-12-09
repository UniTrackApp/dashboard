import { prisma } from '~/server/prisma'

import Link from 'next/link'
import { Separator } from '~/components/ui/separator'
import { columns } from './columns'
import { DataTable } from './data-table'

export default async function Records() {
  // Fetch attendance records + their relevant lecture and student data
  const data = await prisma.attendanceRecord.findMany({
    include: {
      Lecture: {
        select: {
          Module: {
            select: {
              moduleName: true,
            },
          },
        },
      },
      Student: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
  })

  return (
    <div className="flex flex-col justify-center">
      <div>
        {/* Title - Title and description on the page */}
        <h1 className="text-2xl font-bold text-foreground">
          Attendance Records
        </h1>
        <p className="mt-1 text-amber-500 dark:text-amber-400">
          This is currently a work in progress and will be missing some
          features. Please use the{' '}
          <Link
            className="underline-offset-4 underline"
            href="/dashboard/records"
          >
            other page
          </Link>{' '}
          if you encounter any issues.
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
