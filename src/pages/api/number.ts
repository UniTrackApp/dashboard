// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type CardInfo = {
  uid: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CardInfo>
) {
  if (req.method === 'POST') {
    const { number } = req.body

    console.log(`Received POST request with number: ${number}`)

    // Store the number in a variable (you can use a database in a production app)
    let latestNumber = number

    res.status(200).json({ uid: latestNumber })
  } else {
    res.status(405).end()
  }
}
