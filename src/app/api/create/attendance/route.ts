import { Status } from '@prisma/client'
import { differenceInMinutes, format, parseISO } from 'date-fns'
import { prisma } from '~/server/prisma'

type RequestBody = {
  studentCardId: string
  lectureId: string
}

export async function POST(req: Request) {
  // Receive studentCardId and lectureId from request body
  const { lectureId, studentCardId } = (await req.json()) as RequestBody

  if (req.body === undefined) {
    return Response.json(
      { error: 'Missing request body' },
      {
        status: 400,
      },
    )
  }

  // If request body is missing parameters, throw errorq
  if (!lectureId || !studentCardId) {
    return Response.json(
      { error: 'Missing parameters in request body' },
      {
        status: 400,
      },
    )
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
    return Response.json({ error: 'Enrollment not found' }, { status: 404 })
  }

  if (!result?.Module) {
    return Response.json({ error: 'Module not found' }, { status: 404 })
  }

  if (!result?.Module.Lectures[0]?.startTime) {
    return Response.json(
      { error: 'Lecture start time not found' },
      { status: 404 },
    )
  }

  if (!result?.Module.Lectures[0]?.lectureId) {
    return Response.json({ error: 'Lecture not found' }, { status: 404 })
  }

  if (!result?.Student) {
    return Response.json({ error: 'Student not found' }, { status: 404 })
  }

  if (!result?.Student.studentId) {
    return Response.json({ error: 'Student not found' }, { status: 404 })
  }

  // Calculate the status of the attendance record based on the time
  const lectureStartTime = result.Module.Lectures[0].startTime
  const formattedDate: string = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSX")
  const currentTime = parseISO(formattedDate)

  const timeDiff = differenceInMinutes(currentTime, lectureStartTime)

  let calculatedStatus: Status = Status.PRESENT

  if (-15 < timeDiff && timeDiff < 15) {
    calculatedStatus = Status.PRESENT
  } else if (timeDiff > 15) {
    calculatedStatus = Status.LATE
  } else if (timeDiff < -15) {
    return Response.json(
      {
        message: 'Too early! Please retry closer to lecture start time.',
      },
      { status: 404 },
    )
  }

  // Creating the attendance record in the database with the calculated status
  const newAttendanceRecord = await prisma.attendanceRecord.create({
    data: {
      studentId: result.Student.studentId,
      lectureId: result.Module.Lectures[0].lectureId,
      status: calculatedStatus,
    },
  })

  // Returns the new attendance record's status to the client
  return Response.json(
    {
      message: 'Attendance record created',
      status: newAttendanceRecord.status,
    },
    { status: 200 },
  )
}
