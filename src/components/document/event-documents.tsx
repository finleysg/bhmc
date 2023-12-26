import { useEventDocuments } from "../../hooks/use-event-documents"
import { ClubEvent } from "../../models/club-event"
import { DocumentType } from "../../models/codes"
import { DocumentList } from "./document-list"

interface EventDocumentsProps {
  clubEvent?: ClubEvent
}

export function EventDocuments({ clubEvent }: EventDocumentsProps) {
  const { data: documents } = useEventDocuments(clubEvent?.id ?? 0)
  const filteredDocuments = documents?.filter((doc) => doc.documentType !== DocumentType.Data) ?? []

  return (
    <DocumentList
      documents={filteredDocuments}
      title="Event Documents"
      noResultMessage="No files yet."
    />
  )
}
