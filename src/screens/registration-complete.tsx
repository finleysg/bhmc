import { useEffect, useState } from "react"

import { Link } from "react-router-dom"

import { RegisteredButton } from "../components/buttons/registered-button"
import { ErrorDisplay } from "../components/feedback/error-display"
import { RandomGif } from "../components/giphy/random-gif"
import { RegistrationMode } from "../context/registration-reducer"
import { useAuth } from "../hooks/use-auth"
import { useEventRegistration } from "../hooks/use-event-registration"
import { useCurrentEvent } from "./event-detail"

export function RegistrationCompleteScreen() {
  const { user } = useAuth()
  const { clubEvent } = useCurrentEvent()
  const { completeRegistration, currentStep, error, mode, registration, setError } =
    useEventRegistration()
  const [arrivalMode] = useState<RegistrationMode>(mode)

  useEffect(() => {
    completeRegistration()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="row">
      <div className="col-12 col-md-6">
        <div className="card border border-primary mb-4">
          <div className="card-body">
            <h4 className="card-header mb-2">{currentStep.title}</h4>
            {error && (
              <ErrorDisplay error={error?.message} delay={5000} onClose={() => setError(null)} />
            )}
            <p className="text-info fst-italic">{registration?.selectedStart}</p>
            <div className="row mb-4">
              <div className="col-12">
                {arrivalMode === "edit" && (
                  <p>
                    Your registration has been updated. You should receive an email receipt from our
                    payment provider.
                  </p>
                )}
                {arrivalMode === "new" && (
                  <>
                    <h5 className="text-primary-emphasis">You&apos;re In!</h5>
                    <p>
                      A confirmation email will be sent to {user.email}, as well as a receipt from
                      our payment provider.
                    </p>
                    <RandomGif enabled={true} />
                  </>
                )}
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-12" style={{ textAlign: "right" }}>
                {clubEvent && <RegisteredButton clubEvent={clubEvent} />}
                <Link to="/home" className="btn btn-sm btn-primary ms-2">
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
