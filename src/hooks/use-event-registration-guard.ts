import { useEffect } from "react"

import { useNavigate } from "react-router-dom"

import { ClubEvent } from "../models/club-event"
import { Registration } from "../models/registration"
import { useMyRegistrationStatus } from "./use-my-registration-status"

export function useEventRegistrationGuard(clubEvent: ClubEvent, registration: Registration | null) {
  const navigate = useNavigate()
  const hasSignedUp = useMyRegistrationStatus(clubEvent.id)

  useEffect(() => {
    if (!registration?.id || hasSignedUp) {
      navigate(clubEvent.eventUrl)
    }
  }, [hasSignedUp, navigate, clubEvent.eventUrl, registration?.id])
}
