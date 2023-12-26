import { useMutation, useQueryClient } from "@tanstack/react-query"

import { httpClient } from "../utils/api-client"
import { apiUrl } from "../utils/api-utils"

interface ImportScoresArgs {
  eventId: number
  documentId: number
}

export function useImportScores() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, documentId }: ImportScoresArgs) => {
      return httpClient(apiUrl("import-scores"), {
        method: "POST",
        body: JSON.stringify({
          event_id: eventId,
          document_id: documentId,
        }),
      })
    },
    onSuccess: (data: string[], args) => {
      queryClient.invalidateQueries({ queryKey: ["scores", args.eventId] })
      return data
    },
  })
}
