/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownloadButton } from "./download-button"

interface RenderReportDataProps {
  title: string
  reportName: string
  reportHeader: string[]
  reportData: any[][]
}

export function RenderReportData({
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
                  <tr key={`${row[0]}-${rx}`}>
                    {row.map((cell, cx) => {
                      return (
                        <td key={`${cell}-${cx}`} className="report-cell">
                          {cell}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
