import { useState } from "react"

import { CardContent } from "../../components/card/content"
import { ErrorDisplay } from "../../components/feedback/error-display"
import { EventPointsList } from "../../components/points/event-points-list"
import { ImportFailureList } from "../../components/points/import-failure-list"
import { ImportPointsForm } from "../../components/points/import-points-form"
import { OverlaySpinner } from "../../components/spinners/overlay-spinner"
import { useEventDocumentSave } from "../../hooks/use-event-documents"
import { ImportFailure, useImportPoints } from "../../hooks/use-import-points"
import { useSeasonLongPoints } from "../../hooks/use-season-long-points"
import { DocumentType } from "../../models/codes"
import { useEventAdmin } from "../layout/event-admin"

export function ImportPointsScreen() {
  const { clubEvent } = useEventAdmin()
  const [importFailures, setImportFailures] = useState<ImportFailure[]>([])
  const { data: points, status } = useSeasonLongPoints({ eventId: clubEvent.id })
  const {
    mutateAsync: uploadFile,
    status: uploadStatus,
    error: uploadError,
  } = useEventDocumentSave(clubEvent.id)
  const { mutateAsync: importPoints, status: importStatus, error: importError } = useImportPoints()

  const handleUpload = async (category: string, file: File) => {
    setImportFailures([])

    const form = new FormData()
    form.append("document_type", DocumentType.Data)
    form.append("event", clubEvent.id.toString())
    form.append("year", clubEvent.season.toString())
    form.append("title", `${clubEvent.name} ${category} Points`)
    form.append("file", file, clubEvent.normalizeFilename(file.name))

    const dataDocument = await uploadFile({ formData: form })
    const results = await importPoints({ event: clubEvent.id, document: dataDocument.id, category })
    if (results && results.length > 0) {
      setImportFailures(results)
    }
  }

  return (
    <div className="row">
      <div className="col-lg-4 col-md-6 col-sm-12">
        <CardContent contentKey="import-points">
          <>
            <OverlaySpinner loading={uploadStatus === "pending" || importStatus === "pending"} />
            <ImportPointsForm onSubmit={handleUpload} />
            {uploadError && (
              <ErrorDisplay error={uploadError.message} delay={5000} onClose={() => void 0} />
            )}
            {importError && (
              <ErrorDisplay error={importError.message} delay={15000} onClose={() => void 0} />
            )}
          </>
        </CardContent>
      </div>
      <div className="col-lg-4 col-md-6 col-sm-12">
        <div className="card">
          <div className="card-body">
            <OverlaySpinner loading={status === "pending"} />
            <h4 className="card-header mb-2">Imported Points</h4>
            <EventPointsList points={points ?? []} />
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-6 col-sm-12">
        {importFailures.length > 0 && (
          <CardContent contentKey="import-points-fail">
            <ImportFailureList failures={importFailures} />
          </CardContent>
        )}
      </div>
    </div>
  )
}
