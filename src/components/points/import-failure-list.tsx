import { ImportFailure } from "../../hooks/use-import-points"

export function ImportFailureList({ failures }: { failures: ImportFailure[] }) {
  return (
    <div style={{ overflowY: "auto", overflowX: "auto" }}>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th>GHIN</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {failures.map((row) => {
            return (
              <tr key={row.ghin}>
                <td>{row.ghin}</td>
                <td>{row.first_name}</td>
                <td>{row.last_name}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
