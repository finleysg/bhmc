import { useEventRegistration } from "../../hooks/use-event-registration"
import { NoAmount } from "../../models/payment"
import { ErrorDisplay } from "../feedback/error-display"
import { OverlaySpinner } from "../spinners/overlay-spinner"
import { RegistrationSlotLineItemReview } from "./registration-slot-line-item-review"

interface RegistrationConfirmProps {
  selectedStart: string
  title: string
  onBack: () => void
  onCancel: () => void
  onComplete: () => void
}

export function RegistrationConfirm({
  selectedStart,
  title,
  onBack,
  onComplete,
  onCancel,
}: RegistrationConfirmProps) {
  const { clubEvent, registration, payment, error, setError } = useEventRegistration()

  const isBusy = !payment?.hasPaymentDetails()
  const amountDue = payment?.getAmountDue(clubEvent?.feeMap) ?? NoAmount

  return (
    <div className="card border border-primary mb-4">
      <div className="card-body">
        <OverlaySpinner loading={isBusy} />
        <h4 className="card-header mb-2">{title}</h4>
        {error && (
          <ErrorDisplay error={error?.message} delay={5000} onClose={() => setError(null)} />
        )}
        <p className="text-info fst-italic">{selectedStart}</p>
        {clubEvent &&
          payment &&
          registration &&
          registration.slots
            .filter((s) => Boolean(s.playerId))
            .map((slot) => {
              return (
                <RegistrationSlotLineItemReview
                  key={slot.id}
                  slot={slot}
                  team={slot.getTeamNumber(clubEvent.teamSize)}
                  paymentDetails={payment.details}
                  fees={clubEvent.fees}
                />
              )
            })}
        <div className="text-primary mb-2 me-1 fw-bold" style={{ textAlign: "right" }}>
          Amount Due: ${amountDue.total.toFixed(2)}
        </div>
        {registration && registration.notes && (
          <div className="mb-2">
            <span className="text-primary">Notes / Requests</span>
            <p className="fst-italic m-0">{registration.notes}</p>
          </div>
        )}
        <hr />
        <div style={{ textAlign: "right" }}>
          <button className="btn btn-secondary" disabled={isBusy} onClick={onBack}>
            Back
          </button>
          <button className="btn btn-secondary ms-2" disabled={isBusy} onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary ms-2" disabled={isBusy} onClick={onComplete}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
