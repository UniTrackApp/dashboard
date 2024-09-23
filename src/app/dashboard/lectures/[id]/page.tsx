import React from 'react'
import { api } from '~/app/trpc/server'

export default async function IndividualStudentPage({
  params,
}: {
  params: { id: string }
}) {
  const data = await api.student.getStudentById.query(params.id)

  return (
    <div>
      <p>IndividualStudentPage</p>
      {!data && <p>Error: Student doesn&apos;t exist with ID: {params.id}</p>}
      {!!data && (
        <div>
          <p>{data.firstName}</p>
          <p>{data.lastName}</p>
          <p>{data.studentId}</p>
          <p>{data.studentCardId}</p>
        </div>
      )}
    </div>
  )
}
