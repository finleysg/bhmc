import { useQuery } from "@tanstack/react-query"

import { Score, ScoreApiData, ScoreApiSchema } from "../models/scores"
import { getMany } from "../utils/api-client"

export function usePlayerScores(season: number, playerId: number | undefined, isNet: boolean) {
	const endpoint = `scores/?season=${season}&player_id=${playerId}&is_net=${isNet}`
	return useQuery({
		queryKey: ["scores", season, playerId, isNet],
		queryFn: () => getMany<ScoreApiData>(endpoint, ScoreApiSchema),
		select: (data) => data.map((score) => new Score(score)),
		enabled: playerId !== undefined && playerId > 0,
	})
}
