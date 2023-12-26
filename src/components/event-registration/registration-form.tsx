import { ChangeEvent, ComponentPropsWithoutRef, useState } from "react"

import { RegistrationMode } from "../../context/registration-reducer"
import { useEventRegistration } from "../../hooks/use-event-registration"
import { NoAmount } from "../../models/payment"
import { ErrorDisplay } from "../feedback/error-display"
import { OverlaySpinner } from "../spinners/overlay-spinner"
import { RegistrationAmountDue } from "./registration-amount-due"
import { RegistrationSlotGroup } from "./registration-slot-group"

interface RegistrationFormProps extends ComponentPropsWithoutRef<"div"> {
  layout: "horizontal" | "vertical"
  mode: RegistrationMode
  selectedStart: string
  title: string
  onCancel: () => void
  onComplete: () => void
}

export function RegistrationForm({
  layout,
  mode,
  selectedStart,
  title,
  onCancel,
  onComplete,
  ...rest
}: RegistrationFormProps) {
  const {
    clubEvent,
    error,
    payment,
    registration,
    addFee,
    removeFee,
    removePlayer,
    savePayment,
    setError,
    updateRegistrationNotes,
  } = useEventRegistration()

  const [notes, setNotes] = useState<string>(clubEvent?.notes ?? "")
  const isBusy = !registration?.id
  const amountDue = payment?.getAmountDue(clubEvent?.feeMap) ?? NoAmount

  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
  }

  const handleConfirm = () => {
    updateRegistrationNotes(notes)
    savePayment(onComplete)
  }

  return (
    <div className="card border border-primary mb-4" {...rest}>
      <div className="card-body">
        <OverlaySpinner loading={isBusy} />
        <h4 className="card-header mb-2">{title}</h4>
        {error && (
          <ErrorDisplay error={error?.message} delay={5000} onClose={() => setError(null)} />
        )}
        <p className="text-info fst-italic">{selectedStart}</p>
        {clubEvent && payment && registration && (
          <RegistrationSlotGroup
            eventFees={clubEvent.fees}
            registration={registration}
            payment={payment}
            removePlayer={removePlayer}
            addFee={addFee}
            removeFee={removeFee}
            layout={layout}
            mode={mode}
            teamSize={clubEvent.teamSize}
            skinsType={clubEvent.skinsType}
          />
        )}
        <RegistrationAmountDue amountDue={amountDue} />
        <hr />
        {registration && (
          <div className="row">
            <div className="col-12">
              <label className="text-primary" htmlFor="notes">
                Notes / Special Requests
              </label>
              <textarea
                id="notes"
                name="notes"
                className="form-control fc-alt"
                defaultValue={registration.notes ?? ""}
                onChange={handleNotesChange}
                readOnly={mode === "edit"}
                rows={5}
              ></textarea>
            </div>
          </div>
        )}
        <div className="row mt-2" style={{ textAlign: "right" }}>
          <div className="col-12">
            <button className="btn btn-secondary" disabled={isBusy} onClick={() => onCancel()}>
              Cancel
            </button>
            <button className="btn btn-primary ms-2" disabled={isBusy} onClick={handleConfirm}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
