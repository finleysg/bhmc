import { useQuery } from "@tanstack/react-query"

import { TopPoints, TopPointsData, TopPointsSchema } from "../models/points"
import { getMany } from "../utils/api-client"

interface SeasonLongPointsArgs {
  season: number
  topN: number
  category: "gross" | "net"
}

export function useSeasonLongPoints({ season, topN, category }: SeasonLongPointsArgs) {
  const endpoint = `points/${season}/${category}/${topN}/`

  return useQuery({
    queryKey: ["season-long-points", season, category, topN],
    queryFn: () => getMany<TopPointsData>(endpoint, TopPointsSchema),
    select: (data) => data.map((pt) => new TopPoints(pt)),
  })
}
