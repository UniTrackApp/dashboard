import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '~/server/db';
import { AttendanceStatus } from "~/utils/constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const lectureId = req.query.lectureId as string;
    const studentCardId = req.query.studentCardId as string;

    try {
      const student = await db.student.findUniqueOrThrow({
        where: {
          studentCardId: studentCardId,
        },
      });
      
      const moduleId = await db.lecture.findUniqueOrThrow({
        where: {
          lectureId: lectureId,
        },
        select: {
          Module: {
            select:{
              moduleId: true,
            }
          }
        },
      });

      const newAttendanceRecord = await db.attendanceRecord.create({
        data: {
          studentId: '77240000',
          lectureId: 'COMP766-001',
          status: AttendanceStatus.PRESENT,

        },
      })


      if (!moduleId) {
        res.status(404).send({ message: 'Lecture not found' });
        return;
      }

//create attendance record 

      res.status(200).send({ message: { student, moduleId, newAttendanceRecord} });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).send({ error: 'Internal Server Error', details: error });
    }
    
  } else {
    res.status(405).json({ error: 'Method Not Allowell' });
  }
}