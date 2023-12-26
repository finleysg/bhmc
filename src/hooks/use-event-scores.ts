import { useQuery } from "@tanstack/react-query"

import { Score, ScoreApiData, ScoreApiSchema } from "../models/scores"
import { getMany } from "../utils/api-client"

export function useEventScores(eventId: number) {
  const endpoint = `scores/?event=${eventId}`
  return useQuery({
    queryKey: ["scores", eventId],
    queryFn: () => getMany<ScoreApiData>(endpoint, ScoreApiSchema),
    select: (data) => data.map((score) => new Score(score)),
  })
}
