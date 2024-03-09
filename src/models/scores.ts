import { z } from "zod"

import { isoDayFormat } from "../utils/date-utils"
import { ClubEvent } from "./club-event"
import { Course, Hole, HoleApiSchema } from "./course"

export const ScoreApiSchema = z.object({
  id: z.number(),
  event: z.number(),
  player: z.number(),
  hole: HoleApiSchema,
  score: z.number(),
  is_net: z.boolean(),
})

export type ScoreApiData = z.infer<typeof ScoreApiSchema>

export class Score {
  id: number
  eventId: number
  playerId: number
  hole: Hole
  score: number
  isNet: boolean

  constructor(json: ScoreApiData) {
    this.id = json.id
    this.eventId = json.event
    this.playerId = json.player
    this.hole = new Hole(json.hole)
    this.score = json.score
    this.isNet = json.is_net
  }
}

export class ScoreByHole {
  hole: Hole
  score: string

  constructor(obj: { hole: Hole; score: number; places?: number }) {
    this.hole = obj.hole
    this.score = obj.score.toFixed(obj.places ?? 0)
  }

  relativeScoreName = () => {
    if (+this.score === this.hole.par) {
      return "par"
    } else if (+this.score === this.hole.par - 1) {
      return "birdie"
    } else if (+this.score === this.hole.par - 2) {
      return "eagle"
    } else if (+this.score === this.hole.par - 3) {
      return "double-eagle"
    } else if (+this.score === this.hole.par + 1) {
      return "bogey"
    } else if (+this.score === this.hole.par + 2) {
      return "double-bogey"
    } else {
      return "other"
    }
  }

  relativeScoreToPar = () => {
    if (+this.score < this.hole.par) {
      return "below-par"
    } else {
      return "above-par"
    }
  }
}

export class Round {
  course: Course
  eventName: string
  eventDate: string
  scores: ScoreByHole[]

  constructor(course: Course, event: ClubEvent, scores: ScoreByHole[]) {
    this.course = course
    this.eventName = event.name
    this.eventDate = isoDayFormat(event.startDate)
    this.scores = scores
  }
}

export const LoadRounds = (courses: Course[], events: ClubEvent[], scores: Score[]) => {
  const rounds: Round[] = []
  const scoresByEvent = scores?.reduce((byEvent, score) => {
    if (!byEvent.has(score.eventId)) {
      byEvent.set(score.eventId, [])
    }

    byEvent.get(score.eventId)!.push(new ScoreByHole(score))

    return byEvent
  }, new Map<number, ScoreByHole[]>())

  for (const eventId of scoresByEvent.keys()) {
    const scores = scoresByEvent.get(eventId)
    if (scores) {
      const course = getCourse(courses, scores[0].hole)
      const clubEvent = events.find((e) => e.id === eventId)
      if (course && clubEvent) {
        rounds.push(new Round(course, clubEvent, scores))
      }
    }
  }
  return rounds
}

// TODO: this can be improved
const getCourse = (courses: Course[], firstHole: Hole) => {
  return courses?.find((course) => course.holes.findIndex((hole) => hole.id === firstHole.id) >= 0)
}
