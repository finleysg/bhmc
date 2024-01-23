import { useState } from "react"

import { toast } from "react-toastify"

import { CardContent } from "../../components/card/content"
import { ErrorDisplay } from "../../components/feedback/error-display"
import { ImportScoresForm } from "../../components/scores/import-scores-form"
import { OverlaySpinner } from "../../components/spinners/overlay-spinner"
import { useEventDocumentSave } from "../../hooks/use-event-documents"
import { useImportScores } from "../../hooks/use-import-scores"
import { DocumentType } from "../../models/codes"
import { useEventAdmin } from "../layout/event-admin"

export function ImportScoresScreen() {
  const { clubEvent } = useEventAdmin()
  const [importFailures, setImportFailures] = useState<string[]>([])
  // const { data: scores, status } = useEventScores(clubEvent.id)
  const {
    mutateAsync: uploadFile,
    status: uploadStatus,
    error: uploadError,
  } = useEventDocumentSave(clubEvent.id)
  const { mutateAsync: importScores, status: importStatus, error: importError } = useImportScores()

  const handleUpload = async (file: File) => {
    setImportFailures([])

    const form = new FormData()
    form.append("document_type", DocumentType.Data)
    form.append("event", clubEvent.id.toString())
    form.append("year", clubEvent.season.toString())
    form.append("title", `${clubEvent.name} Leaderboard`)
    form.append("file", file, clubEvent.normalizeFilename(file.name))

    const dataDocument = await uploadFile({ formData: form })
    const results = await importScores({ eventId: clubEvent.id, documentId: dataDocument.id })
    if (results && results.length > 0) {
      setImportFailures(results)
    }
    toast.success("Scores imported successfully")
  }

  return (
    <div className="row">
      <div className="col-lg-4 col-md-6 col-sm-12">
        <CardContent contentKey="import-scores">
          <>
            <OverlaySpinner loading={uploadStatus === "pending" || importStatus === "pending"} />
            <ImportScoresForm commandName="Import Scores" onSubmit={handleUpload} />
            {uploadError && (
              <ErrorDisplay error={uploadError.message} delay={5000} onClose={() => void 0} />
            )}
            {importError && (
              <ErrorDisplay error={importError.message} delay={15000} onClose={() => void 0} />
            )}
          </>
        </CardContent>
      </div>
      {/* <div className="col-lg-4 col-md-6 col-sm-12">
        <div className="card">
          <div className="card-body">
            <OverlaySpinner loading={status === "pending"} />
            <h4 className="card-header mb-2">Imported Scores</h4>
            <EventPointsList points={points ?? []} />
          </div>
        </div>
      </div> */}
      <div className="col-lg-4 col-md-6 col-sm-12">
        {importFailures.length > 0 && (
          <CardContent contentKey="import-scores-fail">
            <ul>
              {importFailures.map((message) => {
                return <li key={message}>{message}</li>
              })}
            </ul>
          </CardContent>
        )}
      </div>
    </div>
  )
}
