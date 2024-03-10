import { useMutation, useQueryClient } from "@tanstack/react-query"

import { httpClient } from "../utils/api-client"
import { apiUrl } from "../utils/api-utils"

interface RegistrationUpdateArgs {
  registrationId: number
  notes: string
}

export function useRegistrationUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ registrationId, notes }: RegistrationUpdateArgs) => {
      return httpClient(apiUrl(`registration/${registrationId}`), {
        method: "PATCH",
        body: JSON.stringify({
          notes: notes,
        }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-registrations"] })
    },
  })
}
