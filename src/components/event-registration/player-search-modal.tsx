import { useState, useRef, useEffect } from "react"
import { TypeaheadRef } from "react-bootstrap-typeahead"
import { Modal } from "../dialog/modal"
import { MultiplePlayerPicker } from "../directory/multiple-player-picker"
import { usePlayers } from "../../hooks/use-players"
import { useEventRegistrationSlots } from "../../hooks/use-event-registration-slots"
import { RegistrationType } from "../../models/codes"
import type { ClubEvent } from "../../models/club-event"
import type { Player } from "../../models/player"

interface PlayerSearchModalProps {
	show: boolean
	onClose: () => void
	onConfirm: (players: Player[]) => void
	clubEvent: ClubEvent
	minChars?: number
}

export function PlayerSearchModal({ show, onClose, onConfirm, clubEvent, minChars = 3 }: PlayerSearchModalProps) {
	const { data: allPlayers = [], isLoading } = usePlayers()
	const { data: slots = [] } = useEventRegistrationSlots(clubEvent.id)
	const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
	const typeaheadRef = useRef<TypeaheadRef>(null)

	useEffect(() => {
		if (show) {
			typeaheadRef.current?.focus()
		}
	}, [show])

	const isMembersOnly =
		clubEvent.registrationType === RegistrationType.MembersOnly ||
		clubEvent.registrationType === RegistrationType.ReturningMembersOnly

	const registeredPlayerIds = slots.map((slot) => slot.playerId).filter((id) => !!id)

	const handleConfirm = () => {
		onConfirm(selectedPlayers)
		setSelectedPlayers([])
		onClose()
	}

	const handleClose = () => {
		setSelectedPlayers([])
		onClose()
	}

	return (
		<Modal show={show} onClose={handleClose} className="add-player-modal">
			<div className="modal-header mb-4">
				<h5 className="modal-title text-primary">Add Players</h5>
				<button type="button" className="btn-close" aria-label="Close" onClick={handleClose} />
			</div>
			<div className="modal-body">
				<MultiplePlayerPicker
					selectedPlayers={selectedPlayers}
					onChange={setSelectedPlayers}
					players={allPlayers}
					isLoading={isLoading}
					excludeIds={registeredPlayerIds}
					membersOnly={isMembersOnly}
					minChars={minChars}
					typeaheadRef={typeaheadRef}
					id="player-search-typeahead"
				/>
			</div>
			<div className="modal-footer">
				<button type="button" className="btn btn-sm btn-light me-2 mt-2" onClick={handleClose}>
					Cancel
				</button>
				<button
					type="button"
					className="btn btn-sm btn-primary mt-2"
					onClick={handleConfirm}
					disabled={selectedPlayers.length === 0}
				>
					Continue
				</button>
			</div>
		</Modal>
	)
}
