import { isBefore } from "date-fns"
import { Link } from "react-router-dom"

import { RegistrationType } from "../../models/codes"
import { ClubEventProps } from "../../models/common-props"
import { CustomLinkProps } from "./login-button"

export function RegisteredButton({ clubEvent, ...rest }: ClubEventProps & CustomLinkProps) {
  const signupStart = clubEvent.signupStart ?? new Date()
  const canView =
    clubEvent.registrationType !== RegistrationType.None && !isBefore(new Date(), signupStart)

  if (canView) {
    return (
      <Link
        className="btn btn-info btn-sm me-2"
        to={clubEvent.eventUrl + "/registrations"}
        {...rest}
      >
        Who&apos;s Registered?
      </Link>
    )
  }
  return null
}
