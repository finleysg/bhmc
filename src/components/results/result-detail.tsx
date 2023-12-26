import { EventType } from "../../models/codes"
import { ChampionList } from "./champion-list"
import { LowScoresCard } from "./low-scores"
import { ResultDocumentList } from "./result-document-list"

const eventTypeCode = (eventTypeStub: string) => {
  switch (eventTypeStub) {
    case "weeknight-events":
      return EventType.Weeknight
    case "weekend-majors":
      return EventType.Major
    default:
      return EventType.Other
  }
}

interface ResultDetailProps {
  eventTypeStub: string
  season?: number
}

export function ResultDetail({ eventTypeStub, season }: ResultDetailProps) {
  return (
    <div className="row mt-4">
      <div className="col-lg-4 col-md-6 col-12">
        {season && <ResultDocumentList eventType={eventTypeCode(eventTypeStub)} season={season} />}
      </div>
      <div className="col-lg-4 col-md-6 col-12">
        {season && eventTypeStub === "weeknight-events" && <LowScoresCard season={season} />}
        {season && eventTypeStub === "weekend-majors" && <ChampionList season={season} />}
      </div>
      <div className="col-lg-4 col-md-6 col-12">{/* TODO: pictures */}</div>
    </div>
  )
}
