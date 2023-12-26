import { z } from "zod"

import { PlayerApiSchema } from "./player"

export const PointsApiSchema = z.object({
  id: z.number(),
  player: PlayerApiSchema,
  gross_points: z.number().nullish(),
  net_points: z.number().nullish(),
  additional_info: z.string(),
})

export type PointsData = z.infer<typeof PointsApiSchema>

export class Points {
  id: number
  name: string
  category: string
  grossPoints: number
  netPoints: number

  constructor(data: PointsData) {
    this.id = data.id
    this.name = `${data.player.first_name} ${data.player.last_name}`
    this.category = data.additional_info
    this.grossPoints = data.gross_points ?? 0
    this.netPoints = data.net_points ?? 0
  }
}
