import { parse } from "date-fns"
import { useNavigate, useParams } from "react-router-dom"

import { EventRegistrationManager } from "../components/event-registration/event-registration-manager"
import { EventView } from "../components/events/event-view"
import { OverlaySpinner } from "../components/spinners/overlay-spinner"
import { useClubEvents } from "../hooks/use-club-events"
import { ClubEvent } from "../models/club-event"
import { EventType } from "../models/codes"

export function EventDetailScreen() {
  const { eventDate, eventName } = useParams()
  const navigate = useNavigate()

  const startDate = eventDate ? parse(eventDate, "yyyy-MM-dd", new Date()) : new Date()
  const { data: clubEvents } = useClubEvents(startDate.getFullYear())
  const { found, clubEvent } = ClubEvent.getClubEvent(clubEvents, eventDate, eventName)

  if (!eventDate || !eventName) {
    navigate("/home")
  } else if (clubEvent?.eventType === EventType.Membership) {
    navigate("/membership")
  } else if (clubEvent?.eventType === EventType.MatchPlay) {
    navigate("/match-play")
  }

  return (
    <div className="content__inner">
      <OverlaySpinner loading={!found} />
      {clubEvent && clubEvent.paymentsAreOpen() && (
        <EventRegistrationManager clubEvent={clubEvent} />
      )}
      {clubEvent && !clubEvent.paymentsAreOpen() && (
        <EventView
          clubEvent={clubEvent}
          onRegister={function (): void {
            throw new Error("Registration is not open.")
          }}
          onEditRegistration={function (): void {
            throw new Error("Registration is not open.")
          }}
        />
      )}
    </div>
  )
}
