import { CourseProps, RoundProps } from "../../models/common-props"
import { ScoreByHole } from "../../models/scores"

export interface ScoreByHoleProps {
  score: ScoreByHole
}

export interface ScoresByHoleProps {
  scores: ScoreByHole[]
}

export interface RoundTotalProps extends ScoresByHoleProps {
  places: number
}

export function HoleScore({ score }: ScoreByHoleProps) {
  return <div className={score.relativeScoreName()}>{score.score}</div>
}

export function AverageScore({ score }: ScoreByHoleProps) {
  return <div className={score.relativeScoreToPar()}>{score.score}</div>
}

export function RoundTotal({ scores, places }: RoundTotalProps) {
  const totalScore = scores.reduce((total, score) => total + +score.score, 0)
  const par = scores.reduce((total, score) => total + +score.hole.par, 0)

  return (
    <div className={totalScore < par ? "total below-par" : "total above-par"}>
      {Number.parseFloat(totalScore.toString()).toFixed(places)}
    </div>
  )
}

export function HoleNumbers({ course }: CourseProps) {
  return (
    <div style={{ display: "flex" }}>
      <div className="round" style={{ flex: 1 }}></div>
      <div className="hole-numbers">
        {course.holes.map((hole) => {
          return <div key={hole.id}>{hole.holeNumber}</div>
        })}
        <div className="total"></div>
      </div>
    </div>
  )
}

export function HolePars({ course }: CourseProps) {
  return (
    <div style={{ display: "flex" }}>
      <div className="round" style={{ flex: 1 }}></div>
      <div className="scores">
        {course.holes.map((hole) => {
          return (
            <div className={`bg-${course.name.toLowerCase()}-pale`} key={hole.id}>
              {hole.par}
            </div>
          )
        })}
        <div className={`total bg-${course.name.toLowerCase()}-pale`}>36</div>
      </div>
    </div>
  )
}

export function RoundScores({ round }: RoundProps) {
  return (
    <div style={{ display: "flex" }}>
      <div className="round" style={{ flex: 1 }}>
        {round.eventDate}
      </div>
      <div className="scores">
        {round.scores.map((score) => {
          return <HoleScore key={score.hole.id} score={score} />
        })}
        <RoundTotal scores={round.scores} places={0} />
      </div>
    </div>
  )
}
