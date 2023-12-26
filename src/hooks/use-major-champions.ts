import { useQuery } from "@tanstack/react-query"

import { MajorChampion, MajorChampionApiSchema, MajorChampionData } from "../models/major-champion"
import { getMany } from "../utils/api-client"

export function useChampions(season: number) {
  const endpoint = `champions/?season=${season}`

  return useQuery({
    queryKey: [endpoint],
    queryFn: () => getMany<MajorChampionData>(endpoint, MajorChampionApiSchema),
    select: (data) => data.map((champ) => new MajorChampion(champ)),
  })
}
