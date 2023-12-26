import { ComponentPropsWithoutRef } from "react"

import { useNavigate } from "react-router-dom"

import { useAuth } from "../../hooks/use-auth"
import { ClubEventProps } from "../../models/common-props"

export function EventAdminButton({
  clubEvent,
  ...rest
}: ComponentPropsWithoutRef<"button"> & ClubEventProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (user.isAdmin()) {
    return (
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => navigate(clubEvent.adminUrl)}
        {...rest}
      >
        Event Administration
      </button>
    )
  }
  return null
}
