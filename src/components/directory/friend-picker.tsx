import React from "react"

import { PiWarningFill } from "react-icons/pi"

import { useEventRegistration } from "../../hooks/use-event-registration"
import { useMyFriends } from "../../hooks/use-my-friends"
import { ClubEvent } from "../../models/club-event"
import { RegistrationType } from "../../models/codes"
import { Player } from "../../models/player"
import { FriendCard } from "./friend-card"

interface FriendPickerProps {
  clubEvent: ClubEvent
  onSelect: (friend: Player) => void
}

export function FriendPicker({ clubEvent, onSelect }: FriendPickerProps) {
  const { data: friends } = useMyFriends()
  const { setError } = useEventRegistration()

  const handleSelect = (player: Player) => {
    if (clubEvent.registrationType === RegistrationType.MembersOnly && !player.isMember) {
      // toast.error(`Not eligible! ${player.name} is not a member.`)
      setError(new Error(`Not eligible! ${player.name} is not a member.`))
      return
    }
    onSelect(player)
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-header mb-2">My Friends</h5>
        {Boolean(friends?.length) || (
          <p>
            You don&apos;t currently have any members in your Friends list. Anyone you sign up for
            an event will automatically be added to your Friends list.
          </p>
        )}
        {Boolean(friends?.length) && (
          <React.Fragment>
            {friends?.map((friend) => {
              return <FriendCard key={friend.id} friend={friend} onSelect={handleSelect} />
            })}
            <p>
              Click on a friend&apos;s name to add them to the event. Anyone you sign up for an
              event will automatically be added to your Friends list.
            </p>
            <p>
              <span className="text-warning">
                <PiWarningFill />
              </span>
              <small className="fst-italic">Not a current member.</small>
            </p>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
