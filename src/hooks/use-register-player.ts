import { useMutation, useQueryClient } from "@tanstack/react-query"

import { httpClient } from "../utils/api-client"
import { apiUrl } from "../utils/api-utils"

interface RegisterPlayersArgs {
  playerId: number
  fees: number[]
  slotId?: number
  notes?: string
}

export function useRegisterPlayer(eventId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ playerId, fees, slotId, notes }: RegisterPlayersArgs) => {
      return httpClient(apiUrl(`events/${eventId}/add-player/`), {
        method: "PUT",
        body: JSON.stringify({
          player_id: playerId,
          fees: fees,
          slot_id: slotId,
          notes: notes,
        }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-registrations"] })
      queryClient.invalidateQueries({ queryKey: ["event-registration-slots"] })
    },
  })
}
