import { useQuery } from "@tanstack/react-query"

import { Points, PointsApiSchema, PointsData } from "../models/points"
import { getMany } from "../utils/api-client"

interface SeasonLongPointsArgs {
  season?: number
  eventId?: number
  playerId?: number
}

export function useSeasonLongPoints({ season, eventId, playerId }: SeasonLongPointsArgs) {
  let endpoint = "season-long-points/"
  if (season) {
    endpoint += `?season=${season}` + (playerId ? `&player=${playerId}` : "")
  } else if (eventId) {
    endpoint += `?event=${eventId}`
  } else {
    throw new Error(
      "You must provide either a season or an eventId to retrieve season long points.",
    )
  }

  return useQuery({
    queryKey: ["season-long-points", season ?? 0, playerId ?? 0, eventId ?? 0],
    queryFn: () => getMany<PointsData>(endpoint, PointsApiSchema),
    select: (data) => data.map((pt) => new Points(pt)),
  })
}
