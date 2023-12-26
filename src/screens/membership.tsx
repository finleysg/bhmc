import { useState } from "react"

import { CreateAccountButton } from "../components/buttons/create-account-button"
import { LoginButton } from "../components/buttons/login-button"
import { CardContent } from "../components/card/content"
import { EventRegistrationManager } from "../components/event-registration/event-registration-manager"
import { EventView } from "../components/events/event-view"
import { useAuth } from "../hooks/use-auth"
import { useClubEvents } from "../hooks/use-club-events"
import { useMyPlayerRecord } from "../hooks/use-my-player-record"
import { ClubEvent } from "../models/club-event"
import { EventType, RegistrationType } from "../models/codes"
import { currentSeason } from "../utils/app-config"

export function MembershipScreen() {
  const [clubEvent, setClubEvent] = useState<ClubEvent | null>(null)
  const { user } = useAuth()
  const { data: clubEvents } = useClubEvents(currentSeason)
  const { data: player } = useMyPlayerRecord()

  if (!clubEvent && clubEvents && clubEvents.length > 0) {
    // most recent season registration event
    const [evt] = clubEvents.filter((e) => e.eventType === EventType.Membership).slice(-1)
    if (evt) {
      setClubEvent(evt)
    }
  }

  const canRegister = () => {
    if (clubEvent && player) {
      if (clubEvent.registrationType === RegistrationType.ReturningMembersOnly) {
        return player.isReturningMember
      }
      return user.isAuthenticated
    }
    return false
  }

  return (
    <div className="content__inner">
      {clubEvent && player && canRegister() ? (
        <>
          {!player.isMember && <EventRegistrationManager clubEvent={clubEvent} />}
          {player.isMember && (
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
        </>
      ) : (
        <CardContent contentKey="membership">
          {!user.isAuthenticated && (
            <div>
              <p className="text-primary">
                You need to have an account with us and be logged in to register for the{" "}
                {currentSeason} season.
              </p>
              <div>
                <CreateAccountButton />
                <LoginButton />
              </div>
            </div>
          )}
        </CardContent>
      )}
    </div>
  )
}
