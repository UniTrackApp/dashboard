/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient, Status } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Students
  const student_aryan = await prisma.student.upsert({
    where: {
      studentId: "77240000",
    },
    update: {},
    create: {
      studentId: "77240000",
      studentCardId: "ABC123",
      firstName: "Aryan",
      lastName: "Prince",
    },
  });

  const student_andrea = await prisma.student.upsert({
    where: {
      studentId: "33590000",
    },
    update: {},
    create: {
      studentId: "33590000",
      studentCardId: "DEF456",
      firstName: "Andrea",
      lastName: "La Fauci De Leo",
    },
  });

  const student_lewis = await prisma.student.upsert({
    where: {
      studentId: "33560000",
    },
    update: {},
    create: {
      studentId: "33560000",
      studentCardId: "GHI789",
      firstName: "Lewis",
      lastName: "Johnson",
    },
  });

  // Modules
  const module_1 = await prisma.module.create({
    data: {
      moduleId: "COMP766",
      moduleName: "Smart Systems",
      moduleDesc: "A dive into IoT and cloud computing",
    },
  });

  const module_2 = await prisma.module.create({
    data: {
      moduleId: "COMP723",
      moduleName: "Software Engineering",
      moduleDesc: "Learn how to build software with C#",
    },
  });

  const module_3 = await prisma.module.create({
    data: {
      moduleId: "COMP738",
      moduleName: "Network Management",
      moduleDesc: "An advanced look into networking with SNMP",
    },
  });

  // Lectures
  const lecture_1 = await prisma.lecture.create({
    data: {
      lectureId: "COMP766-001",
      moduleId: "COMP766",
      startTime: new Date("2023-11-28T09:00:00.000Z"),
      endTime: new Date("2023-11-28T11:00:00.000Z"),
    },
  });

  const lecture_2 = await prisma.lecture.create({
    data: {
      lectureId: "COMP723-005",
      moduleId: "COMP723",
      startTime: new Date("2023-11-24T10:00:00.000Z"),
      endTime: new Date("2023-11-24T12:00:00.000Z"),
    },
  });

  const lecture_3 = await prisma.lecture.create({
    data: {
      lectureId: "COMP738-009",
      moduleId: "COMP738",
      startTime: new Date("2023-11-21T09:30:00.000Z"),
      endTime: new Date("2023-11-21T11:00:00.000Z"),
    },
  });

  const lecture_4 = await prisma.lecture.create({
    data: {
      lectureId: "COMP766-031",
      moduleId: "COMP766",
      startTime: new Date("2023-11-27T13:00:00.000Z"),
      endTime: new Date("2023-11-27T15:00:00.000Z"),
    },
  });

  const lecture_5 = await prisma.lecture.create({
    data: {
      lectureId: "COMP723-006",
      moduleId: "COMP723",
      startTime: new Date("2023-11-25T11:00:00.000Z"),
      endTime: new Date("2023-11-25T12:30:00.000Z"),
    },
  });

  // Enrollments
  const enrollment_1 = await prisma.enrollment.create({
    data: {
      studentId: "77240000",
      moduleId: "COMP766",
    },
  });

  const enrollment_2 = await prisma.enrollment.create({
    data: {
      studentId: "77240000",
      moduleId: "COMP723",
    },
  });

  const enrollment_3 = await prisma.enrollment.create({
    data: {
      studentId: "33590000",
      moduleId: "COMP723",
    },
  });

  const enrollment_4 = await prisma.enrollment.create({
    data: {
      studentId: "33560000",
      moduleId: "COMP738",
    },
  });

  const enrollment_5 = await prisma.enrollment.create({
    data: {
      studentId: "33560000",
      moduleId: "COMP766",
    },
  });

  // Attendance Records
  const attendanceRecord_1 = await prisma.attendanceRecord.create({
    data: {
      studentId: "77240000",
      lectureId: "COMP766-001",
      status: Status.PRESENT,
      timestamp: new Date("2023-11-28T09:03:24.000Z"),
    },
  });

  const attendanceRecord_2 = await prisma.attendanceRecord.create({
    data: {
      studentId: "33590000",
      lectureId: "COMP766-001",
      status: Status.LATE,
      timestamp: new Date("2023-11-24T09:21:42.000Z"),
    },
  });

  const attendanceRecord_3 = await prisma.attendanceRecord.create({
    data: {
      studentId: "33560000",
      lectureId: "COMP766-001",
      status: Status.ABSENT,
      timestamp: new Date("2023-11-28T11:00:00.000Z"),
    },
  });

  const attendanceRecord_4 = await prisma.attendanceRecord.create({
    data: {
      studentId: "77240000",
      lectureId: "COMP723-005",
      status: Status.LATE,
      timestamp: new Date("2023-11-24T10:24:31.000Z"),
    },
  });

  const attendanceRecord_5 = await prisma.attendanceRecord.create({
    data: {
      studentId: "33590000",
      lectureId: "COMP766-031",
      status: Status.PRESENT,
      timestamp: new Date("2023-11-24T13:01:24.000Z"),
    },
  });

  const attendanceRecord_6 = await prisma.attendanceRecord.create({
    data: {
      studentId: "33560000",
      lectureId: "COMP723-006",
      status: Status.PRESENT,
      timestamp: new Date("2023-11-27T11:02:34.000Z"),
    },
  });

  const attendanceRecord_7 = await prisma.attendanceRecord.create({
    data: {
      studentId: "77240000",
      lectureId: "COMP738-009",
      status: Status.PRESENT,
      timestamp: new Date("2023-11-21T09:41:05.000Z"),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
