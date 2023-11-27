import { Status } from "@prisma/client";
import { time } from "console";
import { differenceInMinutes, format, parseISO } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/prisma";

//1
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const lectureId = req.query.lectureId as string;
    const studentCardId = req.query.studentCardId as string;
    //2
    try {
      const returnedData1 = await prisma.student.findUniqueOrThrow({
        where: {
          studentCardId: studentCardId,
        },
        select: {
          studentId: true,
        },
      });

      if (!returnedData1.studentId) {
        res.status(404).send({ message: "Student card ID not valid" });
        return;
      }

      // 3
      const returnedData2 = await prisma.lecture.findUniqueOrThrow({
        where: {
          lectureId: lectureId,
        },
        select: {
          startTime: true,
          Module: {
            select: {
              moduleId: true,
            },
          },
        },
      });

      if (!returnedData2.Module.moduleId) {
        res.status(404).send({ message: "Lecture not found" });
        return;
      }

      // 4
      const returnedData3 = await prisma.enrollment.findFirstOrThrow({
        where: {
          moduleId: returnedData2.Module.moduleId,
          studentId: returnedData1.studentId,
        },
        select: {
          enrollmentId: true,
        },
      });

      if (!returnedData3.enrollmentId) {
        res.status(404).send({ message: "Student not enrolled" });
        return;
      }

      //5
      const lectureStartTime = returnedData2.startTime;
      const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSX");
      const currentTime = parseISO(formattedDate);

      const timeDiff = differenceInMinutes(currentTime, lectureStartTime);

      let calculatedStatus: Status = Status.PRESENT;

      if (-15 < timeDiff && timeDiff < 15) {
        // timediff = 5
        calculatedStatus = Status.PRESENT;
      } else if (timeDiff > 15) {
        // timediff = 20
        calculatedStatus = Status.LATE;
      } else if (timeDiff < -15) {
        // timediff -500
        res
          .status(404)
          .send({ message: "Please retry closer to lecture start time" });
      }

      //6
      const newAttendanceRecord = await prisma.attendanceRecord.create({
        data: {
          studentId: returnedData1.studentId,
          lectureId: lectureId,
          status: calculatedStatus,
        },
      });

      res.status(200).send({
        message: {
          returnedData1,
          returnedData2,
          returnedData3,
          newAttendanceRecord,
        },
      });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send({ error: "Internal Server Error", details: error });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowell" });
  }
}
