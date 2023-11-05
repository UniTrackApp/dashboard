import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
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

import Sidebar from "~/components/(dashboard)/sidebar";
import { ModeToggle } from "~/components/theme-toggle";
import { buttonVariants } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { inter } from "~/styles/fonts";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const studentCount = await db.student.count();
  const lectureCount = await db.lecture.count();
  const moduleCount = await db.module.count();
  const attendanceCount = await db.attendanceRecord.count();
  const enrollmentCount = await db.enrollment.count();

  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      sessionData: session,
      counts: {
        studentCount,
        lectureCount,
        moduleCount,
        attendanceCount,
        enrollmentCount,
      },
    },
  };
};

export default function Dashboard({
  sessionData,
  counts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <main
        className={`${inter.className} flex min-h-screen gap-4 bg-neutral-100 antialiased dark:bg-neutral-800`}
      >
        {/* Sidebar */}
        <Sidebar sessionData={sessionData} />

        {/* Content */}
        <div className="container mt-8 flex flex-col gap-4">
          <div className="flex">
            <Link href="/dashboard" className="text-3xl font-bold">
              Dashboard
            </Link>
            <div className="ml-auto">
              <ModeToggle />
            </div>
          </div>
          <div>
            <p className="text-xl font-semibold">Quick Stats</p>
            <div className="mt-4 flex flex-1 flex-wrap gap-4 md:flex-nowrap">
              <Card className="" decoration="top" decorationColor="indigo">
                <Text className="mb-2 flex items-center">
                  <Users size={16} className="mr-2" />
                  Students
                </Text>
                <Metric>{counts.studentCount}</Metric>
              </Card>
              <Card className="" decoration="top" decorationColor="indigo">
                <Text className="mb-2 flex items-center">
                  <Clock size={16} className="mr-2" />
                  Lectures
                </Text>
                <Metric>{counts.lectureCount}</Metric>
              </Card>
              <Card className="" decoration="top" decorationColor="indigo">
                <Text className="mb-2 flex items-center">
                  <BookCopy size={16} className="mr-2" />
                  Modules
                </Text>
                <Metric>{counts.moduleCount}</Metric>
              </Card>
              <Card className="" decoration="top" decorationColor="indigo">
                <Text className="mb-2 flex items-center">
                  <CopyCheck size={16} className="mr-2" />
                  Records
                </Text>
                <Metric>{counts.attendanceCount}</Metric>
              </Card>
              <Card className="" decoration="top" decorationColor="indigo">
                <Text className="mb-2 flex items-center">
                  <GraduationCap size={16} className="mr-2" />
                  Enrollments
                </Text>
                <Metric>{counts.enrollmentCount}</Metric>
              </Card>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <Link
              href="/dashboard/register"
              className={buttonVariants({ size: "xl" })}
            >
              <UserPlus className="mr-2" />
              Register New Data
            </Link>
            <Link
              href="/dashboard/view"
              className={buttonVariants({ size: "xl" })}
            >
              <Eye className="mr-2" />
              View Database
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
