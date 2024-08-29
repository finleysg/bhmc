import { ClubDocument } from "./club-document"

export function ClubDocumentsCard() {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h4 className="card-header">Club Documents</h4>
        <ClubDocument code="BYLAW" documentType="O" />
        <ClubDocument code="FIN" documentType="F" />
        <ClubDocument code="ACCTS" documentType="O" />
        <ClubDocument code="SO" documentType="O" />
        <ClubDocument code="HCP" documentType="O" />
        <ClubDocument code="TUT1" documentType="O" />
        <ClubDocument code="TUT2" documentType="O" />
      </div>
    </div>
  )
}
