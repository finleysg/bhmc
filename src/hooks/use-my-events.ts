import { useQuery } from "@tanstack/react-query"

import { RegistrationSlotApiSchema } from "../models/registration"
import { getMany } from "../utils/api-client"
import { currentSeason } from "../utils/app-config"
import { useAuth } from "./use-auth"
import { useMyPlayerRecord } from "./use-my-player-record"

export function useMyEvents() {
  const { user } = useAuth()
  const { data: player } = useMyPlayerRecord()

  const enable = user.isAuthenticated && player !== undefined && player.id > 0
  const endpoint = `registration-slots/?player_id=${player?.id}&seasons=${currentSeason}`

  return useQuery({
    queryKey: ["my-events"],
    queryFn: () => getMany(endpoint, RegistrationSlotApiSchema),
    select: (data) => {
      return data.filter((s) => s.status === "R").map((e) => e.event)
    },
    enabled: enable,
  })
}
