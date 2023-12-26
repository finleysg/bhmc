import { z } from "zod"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { httpClient } from "../utils/api-client"
import { apiUrl } from "../utils/api-utils"

const ImportFailureSchema = z.object({
  ghin: z.string(),
  first_name: z.string(),
  last_name: z.string(),
})
export type ImportFailure = z.infer<typeof ImportFailureSchema>

interface ImportPointsArgs {
  event: number
  document: number
  category: string
}

export function useImportPoints() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (args: ImportPointsArgs) => {
      return httpClient(apiUrl("import-points"), {
        method: "POST",
        body: JSON.stringify(args),
      })
    },
    onSuccess: (data: ImportFailure[]) => {
      queryClient.invalidateQueries({ queryKey: ["season-long-points"] })
      return data
    },
  })
}
