import { ComponentPropsWithoutRef } from "react"

import { IRegistrationStep, PendingStep } from "../../context/registration-reducer"
import { useMyPlayerRecord } from "../../hooks/use-my-player-record"
import { RegistrationType } from "../../models/codes"
import { ClubEventProps } from "../../models/common-props"

interface RegisterButtonProps extends ComponentPropsWithoutRef<"button"> {
  hasSignedUp: boolean
  currentStep: IRegistrationStep
}

export function RegisterButton({
  clubEvent,
  hasSignedUp,
  currentStep,
  onClick,
  ...rest
}: RegisterButtonProps & ClubEventProps) {
  const { data: player } = useMyPlayerRecord()

  const canRegister = () => {
    if (!player) {
      return false
    } else if (!clubEvent.registrationIsOpen()) {
      return false
    } else if (
      clubEvent.registrationType === RegistrationType.ReturningMembersOnly &&
      !player.isReturningMember
    ) {
      return false
    } else if (clubEvent.registrationType === RegistrationType.MembersOnly && !player.isMember) {
      return false
    } else if (clubEvent.registrationType === RegistrationType.GuestsAllowed && !player.isMember) {
      return false
    } else if (clubEvent.ghinRequired && !player.ghin) {
      return false
    }
    return true
  }

  const notVisible =
    hasSignedUp ||
    clubEvent.registrationType === RegistrationType.None ||
    clubEvent.registrationWindow === "past"
  if (notVisible) {
    return null
  }

  const isEnabled = currentStep === PendingStep && canRegister()
  return (
    <button
      className="btn btn-warning btn-sm me-2"
      disabled={!isEnabled}
      onClick={onClick}
      {...rest}
    >
      Sign Up
    </button>
  )
}
