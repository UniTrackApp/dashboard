import type { NextApiRequest, NextApiResponse } from "next";

import { Status } from "@prisma/client";
import { differenceInMinutes, format, parseISO } from "date-fns";
import { prisma } from "~/server/prisma";

type RequestBody = {
  studentCardId: string;
  lectureId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    //1 - Receive studentCardId and lectureId from request body
    const { lectureId, studentCardId } = req.query as RequestBody;

    if (!lectureId || !studentCardId) {
      res.status(400).send({ error: "Missing parameters in request body" });
      return;
    }

    //2 - Check if studentCardId is valid and get its studentId
    try {
      const returnedData1 = await prisma.student
        .findUniqueOrThrow({
          where: {
            studentCardId: studentCardId,
          },
          select: {
            studentId: true,
          },
        })
        .catch((error) => {
          console.log("❌ Error", error);
          res.status(404).send({ error: "Student card ID not valid" });
          return;
        });

      // 3 - Check if lectureId is valid and get its moduleId
      const returnedData2 = await prisma.lecture
        .findUniqueOrThrow({
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
        })
        .catch((error) => {
          console.log("❌ Error", error);
          res.status(404).send({
            error: "Lecture ID not valid",
          });
          return;
        });

      // 4 - Check if student is enrolled in module, if not, throw error
      const returnedData3 = await prisma.enrollment
        .findFirstOrThrow({
          where: {
            moduleId: returnedData2?.Module.moduleId,
            studentId: returnedData1?.studentId,
          },
          select: {
            enrollmentId: true,
          },
        })
        .catch((error) => {
          console.log("❌ Error", error);
          res.status(404).send({ error: "Student not enrolled" });
          return;
        });

      //5 - Calculate the status of the attendance record based on the time
      const lectureStartTime = returnedData2?.startTime;
      const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSX");
      const currentTime = parseISO(formattedDate);

      if (!lectureStartTime) {
        res.status(404).send({ error: "Lecture start time not found" });
        return;
      }
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

      //6 - Creating the attendance record in the database
      if (!returnedData1?.studentId) {
        res.status(404).send({ error: "Student not found" });
        return;
      }
      const newAttendanceRecord = await prisma.attendanceRecord.create({
        data: {
          studentId: returnedData1?.studentId,
          lectureId: lectureId,
          status: calculatedStatus,
        },
      });

      res.status(200).send({
        message: "Attendance record created",
        status: newAttendanceRecord.status,
      });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send({ error: "Internal Server Error", details: error });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowell" });
  }
}
