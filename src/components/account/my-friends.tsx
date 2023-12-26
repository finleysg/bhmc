import React from "react"

import { useMyFriends } from "../../hooks/use-my-friends"
import { CardContent } from "../card/content"
import { PlayerRow } from "../directory/search"

export function MyFriends() {
  const { data: friends } = useMyFriends()

  return (
    <CardContent contentKey="my-friends">
      <React.Fragment>
        {friends?.map((player) => {
          return <PlayerRow key={player.id} player={player} />
        })}
      </React.Fragment>
    </CardContent>
  )
}
