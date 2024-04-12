import { ChangeEvent, useState } from "react"

import { useNavigate } from "react-router-dom"

import { ConfirmDialog } from "../components/dialog/confirm"
import { Dialog } from "../components/dialog/dialog"
import { FriendPickerCard } from "../components/directory/friend-picker-card"
import { FriendPickerPullout } from "../components/directory/friend-picker-pullout"
import { PeoplePicker } from "../components/directory/people-picker"
import { RegisterCountdown } from "../components/event-registration/register-countdown"
import { RegistrationAmountDue } from "../components/event-registration/registration-amount-due"
import { RegistrationSlotGroup } from "../components/event-registration/registration-slot-group"
import { ErrorDisplay } from "../components/feedback/error-display"
import { OverlaySpinner } from "../components/spinners/overlay-spinner"
import { ReviewStep } from "../context/registration-reducer"
import { useEventRegistration } from "../hooks/use-event-registration"
import { useAddFriend } from "../hooks/use-my-friends"
import { NoAmount } from "../models/payment"
import { Player } from "../models/player"
import { useCurrentEvent } from "./event-detail"

export function RegisterScreen() {
  const navigate = useNavigate()
  const { clubEvent } = useCurrentEvent()
  const { mutate: addFriend } = useAddFriend()
  const {
    currentStep,
    error,
    payment,
    registration,
    cancelRegistration,
    canRegister,
    addFee,
    addPlayer,
    removeFee,
    removePlayer,
    savePayment,
    setError,
    updateRegistrationNotes,
    updateStep,
  } = useEventRegistration()

  const [isBusy, setIsBusy] = useState(false)
  const [notes, setNotes] = useState<string>(registration?.notes ?? "")
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showPriorityDialog, setShowPriorityDialog] = useState(false)

  // useEventRegistrationGuard(clubEvent, registration)

  const amountDue = payment?.getAmountDue(clubEvent?.feeMap) ?? NoAmount
  const layout =
    clubEvent?.maximumSignupGroupSize === 1
      ? "vertical"
      : (clubEvent?.fees.length ?? 0) > 5
        ? "vertical"
        : "horizontal"
  const showPickers = (clubEvent?.maximumSignupGroupSize ?? 0) > 1

  const handleFriendSelect = (friend: Player) => {
    const slot = registration?.slots.find((slot) => !slot.playerId)
    if (slot) {
      addPlayer(slot, friend)
    }
  }

  const handlePlayerSelect = (player: Player) => {
    const slot = registration?.slots.find((slot) => !slot.playerId)
    if (slot) {
      addPlayer(slot, player)
      addFriend(player.id)
    }
  }

  const handleCancel = () => {
    setShowCancelDialog(false)
    cancelRegistration()
    navigate("../")
  }

  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
  }

  const handleNextStep = async () => {
    if (!canRegister()) {
      setShowPriorityDialog(true)
      return
    }

    setIsBusy(true)
    setTimeout(() => {
      console.log("Saving payment record...")
    }, 50)

    try {
      updateRegistrationNotes(notes)
      await savePayment()
      updateStep(ReviewStep)
      navigate("../review")
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div className="row">
      <div className="col-12 col-md-6">
        <div className="card border border-primary mb-4">
          <div className="card-body">
            <OverlaySpinner loading={isBusy} />
            <PeoplePicker
              style={{ float: "right", maxWidth: "180px" }}
              allowNew={false}
              clubEvent={clubEvent}
              onSelect={handlePlayerSelect}
            />
            <h4 className="card-header mb-2 text-nowrap">{currentStep.title}</h4>
            {error && (
              <ErrorDisplay error={error?.message} delay={5000} onClose={() => setError(null)} />
            )}
            <div className="d-flex justify-content-between">
              <p className="text-info fst-italic">{registration?.selectedStart}</p>
              {showPickers && (
                <FriendPickerPullout clubEvent={clubEvent} onSelect={handleFriendSelect} />
              )}
            </div>
            {payment && registration && (
              <RegistrationSlotGroup
                eventFees={clubEvent.fees}
                existingFees={[]}
                registration={registration}
                payment={payment}
                removePlayer={removePlayer}
                addFee={addFee}
                removeFee={removeFee}
                layout={layout}
                mode="new"
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
                    readOnly={false}
                    rows={5}
                  ></textarea>
                </div>
              </div>
            )}
            <div className="row mt-2" style={{ textAlign: "right" }}>
              <div className="col-12">
                <RegisterCountdown />
                <button
                  className="btn btn-secondary"
                  disabled={isBusy}
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary ms-2" disabled={isBusy} onClick={handleNextStep}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-3">
        {showPickers && <FriendPickerCard clubEvent={clubEvent} onSelect={handleFriendSelect} />}
        <ConfirmDialog
          show={showCancelDialog}
          title="Cancel Registration?"
          message="Cancel this registration and return to the event detail page."
          onClose={(result) => (result ? handleCancel() : setShowCancelDialog(false))}
        />
        <Dialog
          show={showPriorityDialog}
          title="Large Groups Only"
          onClose={() => setShowPriorityDialog(false)}
        >
          <p>
            During the priority registration period, you must have 4 or 5 players to register.
            Please add more players to your group or cancel your registration and wait until sign
            ups open for everyone.
          </p>
        </Dialog>
      </div>
    </div>
  )
}
