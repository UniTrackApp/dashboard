import { prisma } from '~/server/prisma'

import { Card, Metric, Text } from '@tremor/react'
import { BookCopy, Clock, CopyCheck, Users } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { Separator } from '~/components/ui/separator'
import { getFirstName } from '~/lib/utils'
import { authOptions } from '~/server/auth'

export default async function Dashboard() {
  const studentCount = await prisma.student.count()
  const lectureCount = await prisma.lecture.count()
  const moduleCount = await prisma.module.count()
  const attendanceRecordCount = await prisma.attendanceRecord.count()
  const user = await getServerSession(authOptions)

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          👋 Welcome, {getFirstName(user?.user.name)}
        </h1>
        <p className="mt-1 text-muted-foreground">
          This is your dashboard. You can get an overview of all UniTrack data
          here.
        </p>
        <Separator className="my-6" />
      </div>
      <p className="text-2xl font-semibold">Quick Stats</p>
      <div className="mt-4 flex flex-1 flex-wrap gap-4 md:flex-nowrap">
        <Card decoration="top" decorationColor="indigo">
          <Text className="mb-2 flex items-center">
            <Users size={16} className="mr-2" />
            Students
          </Text>
          <Metric>{studentCount}</Metric>
        </Card>
        <Card decoration="top" decorationColor="indigo">
          <Text className="mb-2 flex items-center">
            <Clock size={16} className="mr-2" />
            Lectures
          </Text>
          <Metric>{lectureCount}</Metric>
        </Card>
        <Card decoration="top" decorationColor="indigo">
          <Text className="mb-2 flex items-center">
            <BookCopy size={16} className="mr-2" />
            Modules
          </Text>
          <Metric>{moduleCount}</Metric>
        </Card>
        <Card decoration="top" decorationColor="indigo">
          <Text className="mb-2 flex items-center">
            <CopyCheck size={16} className="mr-2" />
            Records
          </Text>
          <Metric>{attendanceRecordCount}</Metric>
        </Card>
      </div>
    </div>
  )
}
