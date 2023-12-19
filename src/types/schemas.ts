import { z } from 'zod'

const required = () => z.string().min(1, 'Required field')

export const lectureIdSchema = z
  .string()
  .max(20, 'Must be 20 characters or less')
  .startsWith('COMP', `Lecture ID must start with "COMP"`)

export const lectureIdSchemaRequired = z
  .string()
  .min(1, 'Required field')
  .max(20, 'Must be 20 characters or less')
  .startsWith('COMP', `Lecture ID must start with "COMP"`)

export const moduleIdSchemaOptional = z
  .string()
  .max(10, 'Must be 10 characters or less')
  .startsWith('COMP', `Module ID must start with "COMP"`)

export const moduleIdSchemaRequired = z
  .string()
  .min(1, 'Required field')
  .max(10, 'Must be 15 characters or less')
  .startsWith('COMP', `Module ID must start with "COMP"`)

export const LectureSchemaCreate = z.object({
  lectureId: z
    .string()
    .min(1, 'Required field')
    .max(20, 'Must be 20 characters or less')
    .startsWith('COMP', `Lecture ID must start with "COMP"`),
  moduleId: z
    .string()
    .min(1, 'Required field')
    .max(10, 'Must be 15 characters or less')
    .startsWith('COMP', `Module ID must start with "COMP"`),
  startTime: z.date(),
  endTime: z.date(),
})
