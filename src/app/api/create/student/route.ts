import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client/edge'

const prisma = new PrismaClient()

export const runtime = 'edge'

// This is a zod schema used to validate the request body
const studentInfoSchema = z.object({
  studentId: z
    .string()
    .min(1, 'Required Field')
    .max(10, 'Must be 10 characters or less')
    .regex(/^[0-9]+$/, 'Must be a number'),

  studentCardId: z
    .string()
    .toUpperCase()
    .min(1, 'Required Field')
    .max(10, 'Must be 10 characters or less'),

  firstName: z
    .string()
    .min(1, 'Required Field')
    .max(50, 'Must be 50 characters or less'),

  lastName: z
    .string()
    .min(1, 'Required Field')
    .max(50, 'Must be 50 characters or less'),
})

// This type is infered by the zod schema above
type StudentInfo = z.infer<typeof studentInfoSchema>

export async function POST(request: Request) {
  try {
    const { firstName, lastName, studentCardId, studentId }: StudentInfo =
      studentInfoSchema.parse(await request.json())

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
    console.log(result)

    // Returns a message if student successfully created and the student object
    return Response.json(
      {
        message: 'Student created successfully',
        student: result,
      },
      { status: 200 },
    )
  } catch (error) {
    // Validation error if format of parameters are wrong
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.issues.at(0)?.message },
        { status: 400 },
      )
    }
    // If the student exist will throw an error and send a response to client
    if (error instanceof PrismaClientKnownRequestError) {
      return Response.json({ error: 'Student already exist.' }, { status: 400 })
    }
  }
}
