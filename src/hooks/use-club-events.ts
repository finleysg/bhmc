import { useQuery } from "@tanstack/react-query"

import { ClubEvent, ClubEventApiSchema, ClubEventData } from "../models/club-event"
import { getMany } from "../utils/api-client"
import { currentSeason } from "../utils/app-config"

export function useClubEvents(season?: number | null) {
  const endpoint = `events/?season=${season ? season : currentSeason}`

  return useQuery({
    queryKey: ["club-events", "season", season ? season : currentSeason],
    queryFn: () => getMany<ClubEventData>(endpoint, ClubEventApiSchema),
    select: (data) => data.map((obj) => new ClubEvent(obj)),
  })
}
