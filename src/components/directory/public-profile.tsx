import { PropsWithChildren } from "react"

import clsx from "clsx"
import { MdPerson } from "react-icons/md"

import { useBoardMembers } from "../../hooks/use-board-members"
import { usePlayer } from "../../hooks/use-player"
import { usePlayerAces } from "../../hooks/use-player-aces"
import { usePlayerChampionships } from "../../hooks/use-player-champions"
import * as colors from "../../styles/colors"
import { OverlaySpinner } from "../spinners/overlay-spinner"
import { AceBadge } from "./ace-badge"
import { BoardMemberBadge } from "./board-member-badge"
import { MemberBadge } from "./member-badge"
import { ProfileImage } from "./profile-image"
import { Trophies } from "./trophies"

interface PlayerDetailProps {
  label: string
}

function PlayerDetail({ label, children }: PropsWithChildren<PlayerDetailProps>) {
  return (
    <p style={{ marginBottom: "1rem" }}>
      <span style={{ fontWeight: "bold" }}>{label}:</span> {children}
    </p>
  )
}

interface PlayerProfileProps {
  playerId: number
}

export function PlayerProfile({ playerId }: PlayerProfileProps) {
  const { data: player, status, fetchStatus } = usePlayer(playerId)
  const { data: boardMembers } = useBoardMembers()
  const { data: championships } = usePlayerChampionships(playerId)
  const { data: aces } = usePlayerAces(playerId)

  const isMember = player?.isMember ?? false
  const boardMember = boardMembers?.find((m) => m.player.id === playerId)

  const cardBorder = clsx({
    card: true,
    border: true,
    "border-green": isMember,
    "border-blue": !isMember,
  })

  const cardHeader = clsx({
    "card-header": true,
    "bg-green": isMember,
    "bg-blue": !isMember,
  })

  return (
    <div className={cardBorder} style={{ margin: "auto", maxWidth: "600px" }}>
      <OverlaySpinner loading={status === "pending" || fetchStatus === "fetching"} />
      {player && (
        <>
          <div className={cardHeader} style={{ display: "flex" }}>
            <div style={{ color: colors.white, fontSize: "1.2rem", marginRight: "1rem", flex: 1 }}>
              <MdPerson style={{ fontSize: "2rem", marginRight: "1rem" }} />
              <span>{player.name}</span>
            </div>
            <div style={{ color: colors.white, fontSize: "1rem" }}>
              {boardMember && <span>{boardMember.role}</span>}
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-6 col-12" style={{ marginBottom: "20px" }}>
                <ProfileImage player={player} />
              </div>
              <div className="col-sm-6 col-12">
                <PlayerDetail label="Email">
                  <a href={`mailto: ${player.email}`}>{player.email}</a>
                </PlayerDetail>
                <PlayerDetail label="Phone">
                  <a href={`tel: ${player.phoneNumber}`}>{player.phoneNumber}</a>
                </PlayerDetail>
                <PlayerDetail label="Tees">{player.tee}</PlayerDetail>
                <BoardMemberBadge boardMember={boardMember} />
                <MemberBadge player={player} />
                <AceBadge aces={aces ?? []} />
                <Trophies championships={championships ?? []} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
