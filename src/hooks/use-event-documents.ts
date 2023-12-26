import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { BhmcDocument, DocumentApiSchema, DocumentData } from "../models/document"
import { getMany, httpClient } from "../utils/api-client"
import { apiUrl } from "../utils/api-utils"
import { twoMinutes } from "../utils/app-config"

interface DocumentArgs {
  documentId?: number
  formData: FormData
}

export function useEventDocuments(eventId: number) {
  const endpoint = `documents/?event_id=${eventId}`
  return useQuery({
    queryKey: ["documents", eventId],
    queryFn: () => getMany(endpoint, DocumentApiSchema),
    select: (data) => data.map((doc) => new BhmcDocument(doc)),
    staleTime: twoMinutes,
    enabled: eventId > 0,
  })
}

export function useEventDocumentSave(eventId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (args: DocumentArgs) => {
      if (args.documentId) {
        return httpClient(apiUrl(`documents/${args.documentId}`), {
          body: args.formData,
          method: "PUT",
        })
      } else {
        return httpClient(apiUrl("documents"), { body: args.formData })
      }
    },
    onSuccess: (data: DocumentData) => {
      queryClient.invalidateQueries({ queryKey: ["documents", eventId] })
      return data
    },
  })
}

export function useEventDocumentDelete(eventId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (documentId: number) =>
      httpClient(apiUrl(`documents/${documentId}`), { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", eventId] })
    },
  })
}
