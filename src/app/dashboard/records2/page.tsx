import { prisma } from '~/server/prisma'

import { Badge, Card, Flex, Title } from '@tremor/react'
import { Separator } from '~/components/ui/separator'
import { columns } from './columns'
import { DataTable } from './data-table'

export default async function Records() {
  const attendanceRecordCount = await prisma.attendanceRecord.count()
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
      <div className="space-y-8">
        <Card>
          {/* Card Title - displays table name + item counts */}
          <Flex justifyContent="between">
            <Flex justifyContent="start" className="gap-2">
              <Title>Count</Title>
              <Badge color="blue">{attendanceRecordCount}</Badge>
            </Flex>
          </Flex>
        </Card>

        {/* Table - to display Attendance Records */}
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
