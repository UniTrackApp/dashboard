// import type { NextApiRequest, NextApiResponse } from "next";

// import { db } from "~/server/db";

// type RequestBodyInput = {
//   studentId: string;
//   // add other things we need from req body
// };

// export const handler = async (
//   request: NextApiRequest,
//   response: NextApiResponse,
// ) => {
//   if (request.method == "GET") {
//     const attendanceRecord = await db.attendanceRecord.create({
//       data: {
//         studentId: request.query.uid as string,
//         timestamp: new Date(),
//         status: "PRESENT",
//       },
//     });
//   }
// };

// // For now let's take the status from just request body and test if it all works
// // Then we can later have a function like findAttendanceStatus() that takes in current time and compares with Lecture Table - lectureStartTime
















// // 1. Get RequestInput from request's body
// // 2. Currently we're only taking request query.uid, instead it should take request.query.{} some object that has more info such as mentioned in
// // type RequestBodyInput (line 5)
// // 3. Use that input from request to fill in values in db.create()
// // 4. Don't manually recordId (auto CUID) and timestamp (uses time of DB entry automatically)

// // Let's say I'm making a banking application
// // I am making a 'moneyTransfer*() function that takes in some input and a transfer receipant
// // So I would first use Prisma to remove money from user acct, add money in receipant acct, and create a new transaction record
// // Here, when first step fails, I want the whole 'thing' to be cancelled
// // Here I would put all 3 Prisma functions in a transaction so that if one of them fails, the whole thing is cancelled

// // So for creating a single 'AttendanceRecord' like we are, we don't have to use Prisma transactions.
// // We could, but no real benefit
// // Since it's only one Prisma function, if it fails, it fails (completely).
