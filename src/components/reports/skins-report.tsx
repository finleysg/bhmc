/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"

import { ClubEvent, slugify } from "../../models/club-event"
import { httpClient } from "../../utils/api-client"
import { apiUrl } from "../../utils/api-utils"
import { RenderReportData } from "./render-report-data"
import { getSkinsReportHeader, getSkinsReportRows } from "./report-utils"

interface SkinsReportProps {
  eventId: number
  clubEvent: ClubEvent
}

export function SkinsReport({ eventId, clubEvent }: SkinsReportProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    httpClient(apiUrl(`events/${eventId}/skins-report/`)).then((json) => setData(json))
  }, [eventId])

  const reportName = `${slugify(clubEvent.name)}-skins-report.csv`
  const reportHeader = getSkinsReportHeader()
  const reportData = getSkinsReportRows(clubEvent, data)

  return (
    <RenderReportData
      title="Skins Report"
      reportData={reportData}
      reportHeader={reportHeader}
      reportName={reportName}
    />
  )
}
