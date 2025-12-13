import { useState } from "react"
import { Modal } from "../dialog/modal"
import { MultiplePlayerPicker } from "../directory/multiple-player-picker"
import { RegisteredPlayerSelector } from "./registered-player-selector"
import { usePlayers } from "../../hooks/use-players"
import { useEventRegistrationSlots } from "../../hooks/use-event-registration-slots"
import { RegistrationType } from "../../models/codes"
import type { ClubEvent } from "../../models/club-event"
import type { Registration } from "../../models/registration"
import type { Player } from "../../models/player"

interface ReplacePlayerModalProps {
	show: boolean
	onClose: () => void
	onReplace: (sourcePlayerId: number, targetPlayerId: number) => void
	registration: Registration
	clubEvent: ClubEvent
}

export function ReplacePlayerModal({ show, onClose, onReplace, registration, clubEvent }: ReplacePlayerModalProps) {
	const { data: allPlayers = [], isLoading } = usePlayers()
	const { data: slots = [] } = useEventRegistrationSlots(clubEvent.id)
	const [sourcePlayerId, setSourcePlayerId] = useState<number | null>(null)
	const [targetPlayer, setTargetPlayer] = useState<Player | null>(null)

	const isMembersOnly =
		clubEvent.registrationType === RegistrationType.MembersOnly ||
		clubEvent.registrationType === RegistrationType.ReturningMembersOnly

	const registeredPlayerIds = slots.map((slot) => slot.playerId).filter((id) => !!id)

	const handleSourceChange = (playerIds: number[]) => {
		setSourcePlayerId(playerIds[0] ?? null)
	}

	const handleTargetChange = (players: Player[]) => {
		// Limit to 1: take the most recently added player
		setTargetPlayer(players.length > 0 ? players[players.length - 1] : null)
	}

	const handleReplace = () => {
		if (sourcePlayerId && targetPlayer) {
			console.log({ sourcePlayerId, targetPlayerId: targetPlayer.id })
			onReplace(sourcePlayerId, targetPlayer.id)
		}
	}

	const handleClose = () => {
		setSourcePlayerId(null)
		setTargetPlayer(null)
		onClose()
	}

	const canReplace = sourcePlayerId !== null && targetPlayer !== null

	return (
		<Modal show={show} onClose={handleClose} className="replace-player-modal">
			<div className="modal-header mb-4">
				<h5 className="modal-title text-primary">Replace Player</h5>
				<button type="button" className="btn-close" aria-label="Close" onClick={handleClose} />
			</div>
			<div className="modal-body">
				<div className="mb-4">
					<div className="form-label fw-semibold">Player to replace</div>
					<RegisteredPlayerSelector registration={registration} limit={1} onChange={handleSourceChange} />
				</div>
				<div>
					<div className="form-label fw-semibold">Replacement player</div>
					<MultiplePlayerPicker
						selectedPlayers={targetPlayer ? [targetPlayer] : []}
						onChange={handleTargetChange}
						players={allPlayers}
						isLoading={isLoading}
						excludeIds={registeredPlayerIds}
						membersOnly={isMembersOnly}
						id="replace-player-picker"
					/>
				</div>
			</div>
			<div className="modal-footer">
				<button type="button" className="btn btn-sm btn-light me-2 mt-2" onClick={handleClose}>
					Cancel
				</button>
				<button type="button" className="btn btn-sm btn-primary mt-2" onClick={handleReplace} disabled={!canReplace}>
					Replace
				</button>
			</div>
		</Modal>
	)
}
