import Link from "next/link";

import { db } from "~/server/db";

import { Card, Metric, Text } from "@tremor/react";
import {
  BookCopy,
  Clock,
  CopyCheck,
  Eye,
  GraduationCap,
  UserPlus,
  Users,
} from "lucide-react";

import { buttonVariants } from "~/components/ui/button";

export default async function Dashboard() {
  const studentCount = await db.student.count();
  const lectureCount = await db.lecture.count();
  const moduleCount = await db.module.count();
  const attendanceCount = await db.attendanceRecord.count();
  const enrollmentCount = await db.enrollment.count();

  // const session = await getServerSession();

  //   console.log("session", session);

  //   if (!session || !session.user) {
  //     redirect("/");
  //   }

  return (
    <>
      {/* Content */}
      <div>
        <p className="text-lg font-medium">Quick Stats</p>
        <div className="mt-4 flex flex-1 flex-wrap gap-4 md:flex-nowrap">
          <Card className="" decoration="top" decorationColor="indigo">
            <Text className="mb-2 flex items-center">
              <Users size={16} className="mr-2" />
              Students
            </Text>
            <Metric>{studentCount}</Metric>
          </Card>
          <Card className="" decoration="top" decorationColor="indigo">
            <Text className="mb-2 flex items-center">
              <Clock size={16} className="mr-2" />
              Lectures
            </Text>
            <Metric>{lectureCount}</Metric>
          </Card>
          <Card className="" decoration="top" decorationColor="indigo">
            <Text className="mb-2 flex items-center">
              <BookCopy size={16} className="mr-2" />
              Modules
            </Text>
            <Metric>{moduleCount}</Metric>
          </Card>
          <Card className="" decoration="top" decorationColor="indigo">
            <Text className="mb-2 flex items-center">
              <CopyCheck size={16} className="mr-2" />
              Records
            </Text>
            <Metric>{attendanceCount}</Metric>
          </Card>
          <Card className="" decoration="top" decorationColor="indigo">
            <Text className="mb-2 flex items-center">
              <GraduationCap size={16} className="mr-2" />
              Enrollments
            </Text>
            <Metric>{enrollmentCount}</Metric>
          </Card>
        </div>
      </div>
    </>
  );
}
