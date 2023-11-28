import type { NextApiRequest, NextApiResponse } from 'next'

import { Status } from '@prisma/client'
import { differenceInMinutes, format, parseISO } from 'date-fns'
import { prisma } from '~/server/prisma'

type RequestBody = {
  studentCardId: string
  lectureId: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // Receive studentCardId and lectureId from request body
    const { lectureId, studentCardId } = req.body as RequestBody

    if (req.query !== undefined) {
      res.status(400).send({
        error:
          'Query parameters are invalid, please pass values in request body',
      })
      return
    }

    if (req.body === undefined) {
      res.status(400).send({ error: 'Missing request body' })
      return
    }

    // If request body is missing parameters, throw errorq
    if (!lectureId || !studentCardId) {
      res.status(400).send({ error: 'Missing parameters in request body' })
      return
    }

    // Check if student is enrolled in module, if not, throw error
    const result = await prisma.enrollment.findFirst({
      where: {
        AND: {
          Module: {
            is: {
              Lectures: {
                some: {
                  lectureId: lectureId,
                },
              },
            },
          },

          Student: {
            studentCardId: studentCardId,
          },
        },
      },
      select: {
        Student: {
          select: {
            studentId: true,
          },
        },
        Module: {
          select: {
            Lectures: {
              select: {
                lectureId: true,
                startTime: true,
              },

              where: {
                lectureId: lectureId,
              },
              take: 1,
            },
          },
        },
      },
    })

    // Error handling
    if (!result) {
      res.status(404).send({ error: 'Enrollment not found' })
      return
    }

    if (!result?.Module) {
      res.status(404).send({ error: 'Module not found' })
      return
    }

    if (!result?.Module.Lectures[0]?.startTime) {
      res.status(404).send({ error: 'Lecture start time not found' })
      return
    }

    if (!result?.Module.Lectures[0]?.lectureId) {
      res.status(404).send({ error: 'Lecture not found' })
      return
    }

    if (!result?.Student) {
      res.status(404).send({ error: 'Student not found' })
      return
    }

    if (!result?.Student.studentId) {
      res.status(404).send({ error: 'Student not found' })
      return
    }

    // Calculate the status of the attendance record based on the time
    const lectureStartTime = result.Module.Lectures[0].startTime
    const formattedDate: string = format(
      new Date(),
      "yyyy-MM-dd'T'HH:mm:ss.SSSX",
    )
    const currentTime = parseISO(formattedDate)

    const timeDiff = differenceInMinutes(currentTime, lectureStartTime)

    let calculatedStatus: Status = Status.PRESENT

    if (-15 < timeDiff && timeDiff < 15) {
      calculatedStatus = Status.PRESENT
    } else if (timeDiff > 15) {
      calculatedStatus = Status.LATE
    } else if (timeDiff < -15) {
      res.status(404).send({
        message: 'Too early! Please retry closer to lecture start time.',
      })
    }

    // Creating the attendance record in the database with the calculated status
    const newAttendanceRecord = await prisma.attendanceRecord.create({
      data: {
        studentId: result.Student.studentId,
        lectureId: result.Module.Lectures[0].lectureId,
        status: calculatedStatus,
      },
    })

    res.status(200).send({
      message: 'Attendance record created',
      status: newAttendanceRecord.status,
    })
  } else {
    res.status(405).json({
      error: 'Method not allowed, this endpoint only allows POST requests',
    })
  }
}
