import { parse } from "date-fns"
import { useNavigate, useParams } from "react-router-dom"

import { ReservedGrid } from "../components/reserve/reserved-grid"
import { ReservedList } from "../components/reserve/reserved-list"
import { LoadingSpinner } from "../components/spinners/loading-spinner"
import { useClubEvents } from "../hooks/use-club-events"
import { ClubEvent } from "../models/club-event"

export function RegisteredScreen() {
  const { eventDate, eventName } = useParams()
  const navigate = useNavigate()

  const startDate = eventDate ? parse(eventDate, "yyyy-MM-dd", new Date()) : new Date()
  const { data: clubEvents } = useClubEvents(startDate.getFullYear())
  const { found, clubEvent } = ClubEvent.getClubEvent(clubEvents, eventDate, eventName)

  if (!eventDate || !eventName) {
    navigate("home") // invalid url
  }

  return (
    <div className="content__inner">
      <LoadingSpinner loading={!found} paddingTop="100px" />
      {clubEvent && clubEvent.canChoose && <ReservedGrid clubEvent={clubEvent} />}
      {clubEvent && !clubEvent.canChoose && <ReservedList clubEvent={clubEvent} />}
    </div>
  )
}
