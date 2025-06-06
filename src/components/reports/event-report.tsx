/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"

import { slugify } from "../../models/club-event"
import { ClubEventProps } from "../../models/common-props"
import { httpClient } from "../../utils/api-client"
import { apiUrl } from "../../utils/api-utils"
import { ErrorDisplay } from "../feedback/error-display"
import { FullPageSpinner } from "../spinners/full-screen-spinner"
import { RenderReportData } from "./render-report-data"
import { getEventReportHeader, getEventReportRows } from "./report-utils"

export function EventReport({ clubEvent }: ClubEventProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    httpClient(apiUrl(`reports/event_registration/?event_id=${clubEvent.id}`))
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err: unknown) => {
        setError(err as Error) // we know we get an Error object from api calls
        setLoading(false)
      })
  }, [clubEvent.id])

  const reportName = `${slugify(clubEvent.name)}-event-report.csv`
  const reportHeader = getEventReportHeader(clubEvent)
  const reportData = getEventReportRows(clubEvent, data)

  if (loading) {
    return <FullPageSpinner />
  } else if (error) {
    return <ErrorDisplay error={error.message} delay={5000} onClose={() => setError(null)} />
  } else if (data && data?.length === 0) {
    return <h5 className="text-danger">No report data available.</h5>
  } else {
    return (
      <RenderReportData
        title="Event Report"
        reportData={reportData}
        reportHeader={reportHeader}
        reportName={reportName}
      />
    )
  }
}
