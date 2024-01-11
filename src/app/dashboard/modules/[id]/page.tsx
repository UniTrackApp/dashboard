import React from 'react'
import { api } from '~/app/trpc/server'

export default async function IndividualStudentPage({
  params,
}: {
  params: { id: string }
}) {
  const data = await api.module.getModuleById.query({
    moduleId: params.id,
  })

  const relatedData = await api.module.getModuleLecturesById.query({
    moduleId: params.id,
  })

  console.log('✨ relatedData ->', relatedData)

  return (
    <div>
      <p>IndividualStudentPage</p>
      {!data && <p>Error: Student doesn&apos;t exist with ID: {params.id}</p>}
      {!!data && (
        <div>
          <p>{data.moduleId}</p>
          <p>{data.moduleName}</p>
          <p>{data.moduleDesc}</p>
          <div className='flex flex-col gap-2'>
            {relatedData?.map((lecture) => {
              return (
                <>
                  <div key={lecture.lectureId} className="border border-border">
                    <div>{lecture.lectureId}</div>
                    <div>{lecture.startTime.toString()}</div>
                    <div>{lecture.endTime.toString()}</div>
                  </div>
                </>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
