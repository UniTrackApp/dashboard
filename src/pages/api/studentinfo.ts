import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "~/server/prisma";

export const handler = async (
  request: NextApiRequest,
  response: NextApiResponse,
) => {
  if (request.method == "GET") {
    const uid = request.query.uid as string;

    // Check if the UID is empty or null and returns Bad Request error
    if (uid === "") {
      response.status(400).json({
        error: "Bad request - UID needs to be a string",
      });
      return;
    } else if (!uid) {
      response.status(400).json({
        error: "Bad request - UID parameter needed",
      });
      return;
    }

    // Checking if the student is in database
    try {
      const result = await prisma.student.findUnique({
        where: {
          // Sanitizing the UID
          studentCardId: uid.toUpperCase().trim(),
        },
        select: {
          studentCardId: true,
        },
      });

      // If student is not in DB send Bad Request
      if (result === null) {
        response.status(400).json({
          error: "Bad request - Student does not exist",
          ledStatus: "Red",
        });
      } else {
        // Sending student data and 200 response
        response.status(200).json({
          message: "Student found",
          data: result,
          ledStatus: "Green",
        });
      }

      // Prisma error handling
    } catch (PrismaClientValidationError) {
      response.status(404).json({ error: "Page not found" });
    }
  } else {
    response.status(405);
  }
};

export default handler;
