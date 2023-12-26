import { EventRegistrationManager } from "../components/event-registration/event-registration-manager"
import { EventView } from "../components/events/event-view"
import { LoadingSpinner } from "../components/spinners/loading-spinner"
import { useClubEvents } from "../hooks/use-club-events"
import { EventType } from "../models/codes"
import { currentSeason } from "../utils/app-config"

export function MatchPlayScreen() {
  const { data: clubEvents } = useClubEvents(currentSeason)
  const matchPlayEvent = clubEvents?.find((e) => e.eventType === EventType.MatchPlay)

  const isLoading = !matchPlayEvent?.id

  return (
    <div className="content__inner">
      <LoadingSpinner loading={isLoading} paddingTop="100px" />
      {matchPlayEvent?.registrationIsOpen() && (
        <EventRegistrationManager clubEvent={matchPlayEvent} />
      )}
      {matchPlayEvent && !matchPlayEvent.registrationIsOpen() && (
        <EventView
          clubEvent={matchPlayEvent}
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
