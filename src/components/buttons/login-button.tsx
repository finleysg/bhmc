import React from "react"

import { Link, LinkProps } from "react-router-dom"

import { useAuth } from "../../hooks/use-auth"

export type CustomLinkProps = Omit<LinkProps, "to"> & React.RefAttributes<HTMLAnchorElement>

export function LoginButton(props: CustomLinkProps) {
  const { user } = useAuth()

  if (!user.isAuthenticated) {
    return (
      <Link className="btn btn-info btn-sm me-2" to="/session/login" {...props}>
        Login
      </Link>
    )
  }
}
