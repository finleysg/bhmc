import { useState } from "react"

import { addMinutes } from "date-fns"
import { useNavigate } from "react-router-dom"

import { useCounter } from "../../hooks/use-counter"
import { useEventRegistration } from "../../hooks/use-event-registration"
import { Dialog } from "../dialog/dialog"

export const RegisterCountdown = () => {
  const [showExpiryDialog, setShowExpiryDialog] = useState(false)
  const [doCountdown, setDoCountdown] = useState(true)
  const { cancelRegistration, registration } = useEventRegistration()
  const { minutes, seconds } = useCounter(
    registration?.expires ?? addMinutes(new Date(), 5),
    1000,
    doCountdown,
  )
  const navigate = useNavigate()

  const handleExpiration = () => {
    setShowExpiryDialog(false)
    cancelRegistration()
    navigate("../")
  }

  if (!registration) {
    return null
  }

  if (minutes + seconds <= 0 && doCountdown) {
    setDoCountdown(false)
    setShowExpiryDialog(true)
  }

  return (
    <>
      <p>
        Time remaining to complete registration:{" "}
        <span className="fw-bold" style={{ color: minutes > 0 ? "black" : "red" }}>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </p>
      <Dialog show={showExpiryDialog} title="Time Limit Exceeded" onClose={handleExpiration}>
        <p>
          The time allowed to submit a payment for this registration has passed. You will need to
          start the registration process again.
        </p>
      </Dialog>
    </>
  )
}
