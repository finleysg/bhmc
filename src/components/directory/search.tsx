import React, { ChangeEvent } from "react"

import { debounce } from "lodash"
import { MdStar, MdStarBorder } from "react-icons/md"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

import { useAddFriend, useMyFriends, useRemoveFriend } from "../../hooks/use-my-friends"
import { PlayerProps } from "../../models/common-props"
import { Player, PlayerApiSchema } from "../../models/player"
import * as colors from "../../styles/colors"
import { getMany } from "../../utils/api-client"
import { Spinner } from "../spinners/spinner"

function StarToggle({ player }: PlayerProps) {
  const [isFriend, setIsFriend] = React.useState(player.isFriend)
  const { mutate: add, status: addStatus } = useAddFriend()
  const { mutate: remove, status: removeStatus } = useRemoveFriend()
  const loading = addStatus === "pending" || removeStatus === "pending"

  const addFriend = (friend: Player) => {
    add(friend.id, {
      onSuccess: () => {
        toast.success(`${friend.name} added to your friends list`)
        setIsFriend(true)
      },
    })
  }

  const removeFriend = (friend: Player) => {
    remove(friend.id, {
      onSuccess: () => {
        toast.warn(`${friend.name} removed from your friends list`)
        setIsFriend(false)
      },
    })
  }

  const handleClick = () => {
    if (isFriend) {
      removeFriend(player)
    } else {
      addFriend(player)
    }
  }
  return (
    <div
      style={{
        display: "inline-block",
        marginRight: "10px",
        fontSize: "1.5rem",
        cursor: "pointer",
      }}
      role="button"
      onClick={handleClick}
      onKeyDown={handleClick}
      tabIndex={0}
    >
      {loading ? (
        <Spinner style={{ verticalAlign: "middle" }} />
      ) : isFriend ? (
        <MdStar style={{ verticalAlign: "middle", color: colors.yellow }} />
      ) : (
        <MdStarBorder style={{ verticalAlign: "middle" }} />
      )}
    </div>
  )
}

export function PlayerRow({ player }: PlayerProps) {
  return (
    <div className="mb-2 d-flex align-items-center">
      <StarToggle player={player} />
      <h6 className="text-primary d-inline-block">{player.name}</h6>
      <Link className="btn btn-link text-success-emphasis me-2" to={`/directory/${player.id}`}>
        (player profile)
      </Link>
      <a href={`mailto:${player.email}`}>{player.email}</a>
    </div>
  )
}

export function PlayerSearch() {
  const [results, updateResults] = React.useState<Player[]>([])
  const { data: friends } = useMyFriends()

  const searchPlayers = React.useCallback(
    async (pattern: string) => {
      const results = await getMany(`player-search/?pattern=${pattern}`, PlayerApiSchema)
      const players = results.map((obj) => new Player(obj))
      players.forEach((p) => (p.isFriend = (friends?.findIndex((f) => f.id === p.id) ?? -1) >= 0))
      updateResults(players)
    },
    [friends],
  )

  const doSearch = React.useMemo(() => debounce(searchPlayers, 500), [searchPlayers])

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const pattern = e.target.value?.toLowerCase()
    if (pattern.length >= 3) {
      doSearch(pattern)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search for players..."
          onChange={handleSearch}
        />
      </div>
      <div>
        {results.map((player) => {
          return <PlayerRow key={player.id} player={player} />
        })}
      </div>
    </div>
  )
}
