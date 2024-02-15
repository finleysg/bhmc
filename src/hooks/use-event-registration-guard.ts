import { useEffect } from "react"

import { useNavigate } from "react-router-dom"

import { RegistrationMode } from "../context/registration-reducer"
import { ClubEvent } from "../models/club-event"
import { Registration } from "../models/registration"

export function useEventRegistrationGuard(
  clubEvent: ClubEvent,
  registration: Registration | null,
  mode: RegistrationMode = "new",
) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!registration?.id || mode === "idle" || !clubEvent.paymentsAreOpen()) {
      navigate(clubEvent.eventUrl)
    }
  }, [navigate, clubEvent.eventUrl, registration?.id, mode, clubEvent])
}
