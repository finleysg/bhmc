import { usePaymentData } from "../../hooks/use-payment-data"
import { slugify } from "../../models/club-event"
import { ClubEventProps } from "../../models/common-props"
import { ErrorDisplay } from "../feedback/error-display"
import { FullPageSpinner } from "../spinners/full-screen-spinner"
import { RenderReportData } from "./render-report-data"
import { getPaymentReportHeader, getPaymentReportRows } from "./report-utils"

export function PaymentReport({ clubEvent }: ClubEventProps) {
  const { data, status, error } = usePaymentData(clubEvent.id)

  const reportName = `${slugify(clubEvent.name)}-payment-report.csv`
  const reportHeader = getPaymentReportHeader()
  const reportData = getPaymentReportRows(data ?? [])

  if (status === "pending") {
    return <FullPageSpinner />
  } else if (error) {
    return <ErrorDisplay error={error.message} delay={5000} onClose={() => 0} />
  } else if (data && data?.length === 0) {
    return <h5 className="text-danger">No report data available.</h5>
  } else {
    return (
      <RenderReportData
        title="Payment Report"
        reportData={reportData}
        reportHeader={reportHeader}
        reportName={reportName}
      />
    )
  }
}
