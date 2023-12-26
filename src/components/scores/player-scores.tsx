import { useClubEvents } from "../../hooks/use-club-events"
import { useCourses } from "../../hooks/use-courses"
import { useMyPlayerRecord } from "../../hooks/use-my-player-record"
import { usePlayerScores } from "../../hooks/use-player-scores"
import { CourseProps, RoundsProps, SeasonProps } from "../../models/common-props"
import { Course } from "../../models/course"
import { LoadRounds, ScoreByHole } from "../../models/scores"
import { OverlaySpinner } from "../spinners/overlay-spinner"
import {
  AverageScore,
  HoleNumbers,
  HolePars,
  HoleScore,
  RoundScores,
  RoundTotal,
  ScoresByHoleProps,
} from "./score-utils"

function AverageRound({ scores }: ScoresByHoleProps) {
  return (
    <div style={{ display: "flex" }}>
      <div className="round" style={{ flex: 1 }}>
        Average
      </div>
      <div className="scores">
        {scores.map((score) => {
          return <AverageScore key={score.hole.id} score={score} />
        })}
        <RoundTotal scores={scores} places={1} />
      </div>
    </div>
  )
}

function BestBallRound({ scores }: ScoresByHoleProps) {
  return (
    <div style={{ display: "flex" }}>
      <div className="round" style={{ flex: 1 }}>
        Best Ball
      </div>
      <div className="scores">
        {scores.map((score) => {
          return <HoleScore key={score.hole.id} score={score} />
        })}
        <RoundTotal scores={scores} places={0} />
      </div>
    </div>
  )
}

function RoundsByCourse({ course, rounds }: CourseProps & RoundsProps) {
  const averageScores = () => {
    return course.holes.map((hole) => {
      const scores: ScoreByHole[] = []
      rounds.forEach((round) => {
        scores.push(round.scores.find((score) => score.hole.id === hole.id)!)
      })
      const total = scores.reduce((total, score) => total + +score.score, 0)
      return new ScoreByHole({
        hole,
        score: total / scores.length,
        places: 1,
      })
    })
  }

  const bestScores = () => {
    return course.holes.map((hole) => {
      const scores: ScoreByHole[] = []
      rounds.forEach((round) => {
        scores.push(round.scores.find((score) => score.hole.id === hole.id)!)
      })
      const allScores = scores.map((s) => +s.score)
      const lowScore = Math.min(...allScores)
      return new ScoreByHole({
        hole,
        score: lowScore,
      })
    })
  }

  const headerClass = (course: Course) => {
    return `scores-header bg-${course.name.toLowerCase()}`
  }

  return (
    <div className="card">
      <div className={headerClass(course)}>
        <span>{course.name}</span>
      </div>
      {rounds.length > 0 ? (
        <div className="card-body">
          <HoleNumbers course={course} />
          <HolePars course={course} />
          {rounds.map((round) => {
            return <RoundScores key={round.eventDate} round={round} />
          })}
          <hr />
          <AverageRound scores={averageScores()} />
          <BestBallRound scores={bestScores()} />
        </div>
      ) : (
        <div className="card-body">No rounds played</div>
      )}
    </div>
  )
}

interface PlayerScoresProps extends SeasonProps {
  isNet: boolean
}
export function PlayerScores({ isNet, season }: PlayerScoresProps) {
  const { data: player } = useMyPlayerRecord()
  const { data: events } = useClubEvents(season)
  const { data: courses } = useCourses()
  const { data: scores } = usePlayerScores(season, player?.id, isNet)

  const rounds = LoadRounds(courses ?? [], events ?? [], scores ?? [])

  const busy = !scores || !events || !courses

  return (
    <div className="row mt-2">
      <OverlaySpinner loading={busy} />
      {!busy &&
        courses
          ?.filter((c) => c.numberOfHoles === 9)
          .map((course) => {
            return (
              <div key={course.id} className="col-lg-4 col-md-12">
                <RoundsByCourse
                  course={course}
                  rounds={rounds.filter((r) => r.course.id === course.id)}
                />
              </div>
            )
          })}
    </div>
  )
}
