import { z } from "zod"

export const DocumentApiSchema = z.object({
  id: z.number(),
  year: z.number(),
  title: z.string(),
  document_type: z.string(),
  file: z.string().url(),
  event: z.number().nullish(),
  event_type: z.string().nullish(),
  created_by: z.string(),
  last_update: z.coerce.date(),
})

export const ClubDocumentApiSchema = z.object({
  id: z.number(),
  code: z.string(),
  document: DocumentApiSchema,
})

export type DocumentData = z.infer<typeof DocumentApiSchema>
export type ClubDocumentData = z.infer<typeof ClubDocumentApiSchema>

export class BhmcDocument {
  id: number
  year: number
  title: string
  documentType: string
  file: string
  eventType?: string | null
  eventId?: number | null
  createdBy: string
  lastUpdate: Date

  constructor(data: DocumentData) {
    this.id = data.id
    this.year = data.year
    this.title = data.title
    this.documentType = data.document_type
    this.file = data.file
    this.eventId = data.event
    this.eventType = data.event_type
    this.createdBy = data.created_by
    this.lastUpdate = data.last_update
  }
}

export class ClubDocument {
  id: number
  code: string
  document: BhmcDocument

  constructor(data: ClubDocumentData) {
    this.id = data.id
    this.code = data.code
    this.document = new BhmcDocument(data.document)
  }
}
