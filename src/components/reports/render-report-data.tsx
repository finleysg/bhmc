/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownloadButton } from "./download-button"
import { PaymentDetails } from "./payment-details"
import { RefundDetails } from "./refund-details"
import { ReportRow } from "./report-row"

interface RenderReportDataProps {
  eventId: number
  title: string
  reportName: string
  reportHeader: string[]
  reportData: any[][]
}

const getReportDetail = (eventId: number, reportName: string, data: any[]) => {
  if (reportName.indexOf("payment-report") > 0) {
    const paymentId = data[1] // TODO: this is brittle, need to find a better way to get the payment id
    if (paymentId) {
      return (
        <div className="d-flex">
          <PaymentDetails eventId={eventId} paymentId={paymentId} />
          <RefundDetails eventId={eventId} paymentId={paymentId} />
        </div>
      )
    }
  }
  return null
}

export function RenderReportData({
  eventId,
  reportName,
  reportHeader,
  reportData,
  title,
}: RenderReportDataProps) {
  const getDownloadFile = () => {
    const rows = []
    rows.push(reportHeader.join(","))
    reportData.forEach((row) => rows.push(row.join(",")))
    return rows.join("\r\n")
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex">
          <h4 className="card-title text-primary flex-grow-1">{title}</h4>
          <DownloadButton data={getDownloadFile()} filename={reportName} />
        </div>
        <div style={{ overflowY: "auto" }}>
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                {reportHeader.map((h) => (
                  <th key={h?.replace(" ", "-").toLowerCase()}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, rx) => {
                return (
                  <ReportRow key={`${row[0]}-${rx}`} row={row} rx={rx}>
                    {getReportDetail(eventId, reportName, row)}
                  </ReportRow>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
