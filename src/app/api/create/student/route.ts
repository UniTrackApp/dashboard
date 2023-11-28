// TODO: Andrea, remove this ESLint exception when you start working on this file
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export async function POST(request: Request) {
  const res = await request.json()
  return Response.json({ res })
}
