import { db } from "~/server/db";

import { Card, Metric, Text } from "@tremor/react";
import { BookCopy, Clock, CopyCheck, Users } from "lucide-react";

export default async function Dashboard() {
  const studentCount = await db.student.count();
  const lectureCount = await db.lecture.count();
  const moduleCount = await db.module.count();
  const attendanceRecordCount = await db.attendanceRecord.count();

  return (
    <div>
      <p className="text-lg font-medium">Quick Stats</p>
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
  );
}
