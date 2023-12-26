import React from "react"

import { useNavigate, useParams } from "react-router-dom"

import { PlayerProfile } from "../components/directory/public-profile"
import { useAuth } from "../hooks/use-auth"

export function PlayerProfileScreen() {
  const { user } = useAuth()
  const { playerId } = useParams()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!user.isAuthenticated) {
      navigate("/home")
    }
  }, [user, navigate])

  return (
    <div className="content__inner">
      <div className="row">
        <div className="col-12">{playerId && <PlayerProfile playerId={+playerId} />}</div>
      </div>
    </div>
  )
}
