import { CourseProps, RoundsProps } from "../../models/common-props"
import { HoleNumbers, HolePars, RoundScores } from "./score-utils"

// TODO: this needs player names and ghins for rendering scores by event
export function EventRoundsByCourse({ course, rounds }: CourseProps & RoundsProps) {
  return (
    <div className="card">
      {rounds.length > 0 ? (
        <div className="card-body">
          <h4>{course.name}</h4>
          <HoleNumbers course={course} />
          <HolePars course={course} />
          {rounds.map((round) => {
            return <RoundScores key={round.eventDate} round={round} />
          })}
        </div>
      ) : (
        <div className="card-body">No rounds played</div>
      )}
    </div>
  )
}
