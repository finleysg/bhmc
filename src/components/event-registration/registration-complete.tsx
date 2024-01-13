import { Link } from "react-router-dom"

import { RegistrationMode } from "../../context/registration-reducer"
import { useAuth } from "../../hooks/use-auth"
import { useEventRegistration } from "../../hooks/use-event-registration"
import { RegisteredButton } from "../buttons/registered-button"
import { ErrorDisplay } from "../feedback/error-display"
import { RandomGif } from "../giphy/random-gif"

interface RegistrationCompleteProps {
  mode: RegistrationMode
  selectedStart: string
  title: string
}

export function RegistrationComplete({ selectedStart, title, mode }: RegistrationCompleteProps) {
  const { user } = useAuth()
  const { clubEvent, error, setError } = useEventRegistration()

  return (
    <div className="card border border-primary mb-4">
      <div className="card-body">
        <h4 className="card-header mb-2">{title}</h4>
        {error && (
          <ErrorDisplay error={error?.message} delay={5000} onClose={() => setError(null)} />
        )}
        <p className="text-info fst-italic">{selectedStart}</p>
        <div className="row mb-4">
          <div className="col-12">
            {mode === "edit" && (
              <p>
                Your registration has been updated. You should receive an email receipt from our
                payment provider.
              </p>
            )}
            {mode === "new" && (
              <>
                <h5 className="text-primary-emphasis">You&apos;re In!</h5>
                <p>
                  A confirmation email will be sent to {user.email}, as well as a receipt from our
                  payment provider.
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
  )
}
