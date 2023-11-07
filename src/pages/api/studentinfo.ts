import type { NextApiRequest, NextApiResponse } from "next";
import { string } from "zod";

import { db } from "~/server/db";

export const handler = async (
  request: NextApiRequest,
  response: NextApiResponse,
) => {
  if (request.method == "GET") {
    const uid = request.query.uid as string;

    try {
      const result = await db.student.findUnique({
        where: {
          studentCardId: uid,
        },
        select: {
          studentCardId: true,
        },
      });
      response.status(200).json(result);
    } catch (PrismaClientValidationError) {
      response.status(404).json({ error: "Necessary field empty" });
    }
  } else {
    response.status(405);
  }
};

export default handler;
