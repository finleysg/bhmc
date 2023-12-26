import { ComponentPropsWithoutRef } from "react"

import { PiWarningFill } from "react-icons/pi"

import { Player } from "../../models/player"

interface FriendCardProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  friend: Player
  onSelect: (friend: Player) => void
}

export function FriendCard({ friend, onSelect, ...rest }: FriendCardProps) {
  return (
    <div
      className="friend"
      role="button"
      style={{ cursor: "pointer" }}
      onClick={() => onSelect(friend)}
      onKeyDown={() => onSelect(friend)}
      tabIndex={0}
      {...rest}
    >
      <p className="m-0">
        {friend.name}
        {!friend.isMember && (
          <span className="text-warning">
            <PiWarningFill />
          </span>
        )}
      </p>
    </div>
  )
}
