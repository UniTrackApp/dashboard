import type { NextApiRequest, NextApiResponse } from "next";

import { db } from "~/server/db";

export const handler = async (
  request: NextApiRequest,
  response: NextApiResponse,
) => {
  if (request.method == "GET") {
    const uid = request.query.uid as string;

    try {
      const result = await db.student.findFirst({
        where: {
          studentCardId: uid,
        },
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(500).json({ error: "Server Error" });
    }
  } else {
    response.status(405);
  }
};
