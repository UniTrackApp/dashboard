import { prisma } from '~/server/prisma'

import { Card, Metric, Text } from '@tremor/react'
import { BookCopy, Clock, CopyCheck, Users } from 'lucide-react'
import React from 'react'

export default async function QuickStatsCards() {
  const studentCount = await prisma.student.count()
  const lectureCount = await prisma.lecture.count()
  const moduleCount = await prisma.module.count()
  const attendanceRecordCount = await prisma.attendanceRecord.count()

  return (
    <>
      <div className="mt-4 flex flex-1 flex-wrap gap-4 md:flex-nowrap">
        <Card>
          <Text className="mb-2 flex items-center">
            <Users size={16} className="mr-2" />
            Students
          </Text>
          <Metric>{studentCount}</Metric>
        </Card>
        <Card>
          <Text className="mb-2 flex items-center">
            <Clock size={16} className="mr-2" />
            Lectures
          </Text>
          <Metric>{lectureCount}</Metric>
        </Card>
        <Card>
          <Text className="mb-2 flex items-center">
            <BookCopy size={16} className="mr-2" />
            Modules
          </Text>
          <Metric>{moduleCount}</Metric>
        </Card>
        <Card>
          <Text className="mb-2 flex items-center">
            <CopyCheck size={16} className="mr-2" />
            Records
          </Text>
          <Metric>{attendanceRecordCount}</Metric>
        </Card>
      </div>
    </>
  )
}
