import { ComponentPropsWithoutRef } from "react"

import { IRegistrationStep, PendingStep } from "../../context/registration-reducer"
import { ClubEventProps } from "../../models/common-props"

interface EditRegistrationButtonProps extends ComponentPropsWithoutRef<"button"> {
  hasSignedUp: boolean
  currentStep: IRegistrationStep
}

export function EditRegistrationButton({
  clubEvent,
  hasSignedUp,
  currentStep,
  onClick,
  ...rest
}: EditRegistrationButtonProps & ClubEventProps) {
  if (hasSignedUp && clubEvent.canEditRegistration() && clubEvent.paymentsAreOpen()) {
    return (
      <button
        className="btn btn-warning btn-sm me-2"
        disabled={currentStep !== PendingStep}
        onClick={onClick}
        {...rest}
      >
        Skins
      </button>
    )
  }
  return null
}
