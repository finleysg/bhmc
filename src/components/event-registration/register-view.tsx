import { useState } from "react"

import {
  CompleteStep,
  PaymentStep,
  RegisterStep,
  RegistrationMode,
  ReviewStep,
} from "../../context/registration-reducer"
import { useEventRegistration } from "../../hooks/use-event-registration"
import { useAddFriend } from "../../hooks/use-my-friends"
import { NoAmount } from "../../models/payment"
import { Player } from "../../models/player"
import { ConfirmDialog } from "../dialog/confirm"
import { FriendPicker } from "../directory/friend-picker"
import { PeoplePicker } from "../directory/people-picker"
import { RegistrationComplete } from "./registration-complete"
import { RegistrationConfirm } from "./registration-confirm"
import { RegistrationForm } from "./registration-form"
import { RegistrationPayment } from "./registration-payment"

interface RegisterViewProps {
  mode: RegistrationMode
  selectedStart: string
  onCancel: () => void
}

export function RegisterView({ selectedStart, mode, onCancel }: RegisterViewProps) {
  const {
    clubEvent,
    registration,
    payment,
    currentStep,
    cancelRegistration,
    updateStep,
    addPlayer,
  } = useEventRegistration()
  const { mutate: addFriend } = useAddFriend()

  const [showConfirm, setShowConfirm] = useState(false)

  const layout =
    clubEvent?.maximumSignupGroupSize === 1
      ? "vertical"
      : (clubEvent?.fees.length ?? 0) > 5
      ? "vertical"
      : "horizontal"
  const showPickers = mode === "new" && (clubEvent?.maximumSignupGroupSize ?? 0) > 1

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
    setShowConfirm(false)
    if (mode === "new") {
      console.log("calling cancel")
      cancelRegistration()
    }
    onCancel()
  }

  const handleRegistrationConfirm = () => {
    const amountDue = payment?.getAmountDue(clubEvent?.feeMap) ?? NoAmount
    if (amountDue.total > 0) {
      updateStep(PaymentStep)
    } else {
      updateStep(CompleteStep)
    }
  }

  const handleRegistrationComplete = () => {
    updateStep(CompleteStep)
  }

  return (
    <div className="row">
      <div className="col-12 col-md-6">
        {currentStep === RegisterStep && (
          <div style={{ position: "relative" }}>
            <RegistrationForm
              layout={layout}
              mode={mode}
              title={RegisterStep.title}
              selectedStart={selectedStart}
              onCancel={() => setShowConfirm(true)}
              onComplete={() => updateStep(ReviewStep)}
            />
            {clubEvent && showPickers && (
              <PeoplePicker
                style={{ position: "absolute", top: "12px", right: "30px" }}
                allowNew={false}
                clubEvent={clubEvent}
                onSelect={handlePlayerSelect}
              />
            )}
          </div>
        )}
        {currentStep === ReviewStep && (
          <RegistrationConfirm
            title={ReviewStep.title}
            selectedStart={selectedStart}
            onBack={() => updateStep(RegisterStep)}
            onCancel={() => setShowConfirm(true)}
            onComplete={handleRegistrationConfirm}
          />
        )}
        {currentStep === PaymentStep && (
          <RegistrationPayment
            title={PaymentStep.title}
            selectedStart={selectedStart}
            onBack={() => updateStep(ReviewStep)}
            onCancel={() => setShowConfirm(true)}
            onComplete={handleRegistrationComplete}
          />
        )}
        {currentStep === CompleteStep && (
          <RegistrationComplete
            title={CompleteStep.title}
            mode={mode}
            selectedStart={selectedStart}
          />
        )}
        <ConfirmDialog
          show={showConfirm}
          title="Cancel Registration?"
          message="Cancel this registration and return to the event detail page."
          onClose={(result) => (result ? handleCancel() : setShowConfirm(false))}
        />
      </div>
      {clubEvent && showPickers && currentStep === RegisterStep && (
        <div className="col-12 col-md-3">
          <FriendPicker clubEvent={clubEvent} onSelect={handleFriendSelect} />
        </div>
      )}
    </div>
  )
}
