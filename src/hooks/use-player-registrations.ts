import { useQuery } from "@tanstack/react-query"

import { Registration, RegistrationApiSchema } from "../models/registration"
import { getMany } from "../utils/api-client"
import { twoMinutes } from "../utils/app-config"

export function usePlayerRegistrations(playerId?: number, season?: number) {
	const endpoint = `registration/?player_id=${playerId}` + (season ? `&seasons=${season}` : "")
	return useQuery({
		queryKey: ["player-registrations", playerId],
		queryFn: () => getMany(endpoint, RegistrationApiSchema),
		select: (data) => data.map((r) => new Registration(r)),
		staleTime: twoMinutes,
		enabled: playerId !== undefined && playerId > 0,
	})
}
