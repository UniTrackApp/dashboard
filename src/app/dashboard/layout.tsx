import { Card, Metric, Text } from "@tremor/react";
import { BookCopy, Clock, CopyCheck, Users } from "lucide-react";
import { type ReactNode } from "react";
import Sidebar from "~/app/dashboard/sidebar";
import MobileNavBar from "~/components/mobile-navbar";
import { db } from "~/server/db";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const studentCount = await db.student.count();
  const lectureCount = await db.lecture.count();
  const moduleCount = await db.module.count();
  const attendanceRecordCount = await db.attendanceRecord.count();

  return (
    <div className="grid w-full grid-cols-4 bg-neutral-100 dark:bg-neutral-800 xl:grid-cols-5">
      <div className="sticky top-0 col-span-1 hidden self-start md:block">
        <Sidebar />
      </div>
      <div className="absolute right-0 top-0 md:hidden">
        <MobileNavBar />
      </div>
      <div className="col-span-full md:col-span-3 xl:col-span-4">
        <div className="mx-8 flex flex-col gap-4 pt-4">
          <p className="text-2xl font-semibold">Dashboard</p>
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
                <Metric>{attendanceRecordCount}</Metric>
              </Card>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
