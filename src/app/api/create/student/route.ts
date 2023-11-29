// TODO: Andrea, remove this ESLint exception when you start working on this file
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { z } from 'zod'
import { prisma } from '~/server/prisma'


type StudentInfo = {
  studentId: string
  studentCardId: string
  firstName: string
  lastName: string
}

export async function POST(request: Request) {
  const { studentCardId, studentId, firstName, lastName } =
    (await request.json()) as StudentInfo

  // Error checking if parameters are missing
  if (!studentCardId || !studentId || !firstName || !lastName) {
    return Response.json(
      { error: 'Missing parameters in request body' },
      {
        status: 400,
      },
    )
  }

  // Creates a student with the parameters received from the request body
  const result = await prisma.student.create({
    data: {
      studentCardId: studentCardId,
      studentId: studentId,
      firstName: firstName,
      lastName: lastName,
    },
  })

  // Returns a message if student successfully created and the student object
  return Response.json(
    {
      message: 'Student created successfully',
      student: result,
    },
    { status: 200 },
  )
}
