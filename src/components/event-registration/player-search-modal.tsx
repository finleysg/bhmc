import { useState, useRef, useEffect } from "react"
import { Typeahead, TypeaheadRef } from "react-bootstrap-typeahead"
import { MdClose } from "react-icons/md"
import { Modal } from "../dialog/modal"
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

export function PlayerSearchModal({
  show,
  onClose,
  onConfirm,
  clubEvent,
  minChars = 3,
}: PlayerSearchModalProps) {
  const { data: allPlayers = [], isLoading } = usePlayers()
  const { data: slots = [] } = useEventRegistrationSlots(clubEvent.id)
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const typeaheadRef = useRef<TypeaheadRef>(null)
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    if (show) {
      typeaheadRef.current?.focus()
    }
  }, [show])

  // Determine membership restriction
  const isMembersOnly =
    clubEvent.registrationType === RegistrationType.MembersOnly ||
    clubEvent.registrationType === RegistrationType.ReturningMembersOnly

  // Get IDs of already registered players
  const registeredPlayerIds = slots
    .map((slot) => slot.playerId)
    .filter((id) => !!id)

  // Filter options based on search text, membership, already selected, and registration status
  const options = allPlayers.filter(
    (player) =>
      (!isMembersOnly || player.isMember) &&
      !selectedPlayers.some((sel) => sel.id === player.id) &&
      !registeredPlayerIds.includes(player.id) &&
      (
        player.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        player.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        (player.email?.toLowerCase() ?? "").includes(searchText.toLowerCase())
      )
  )

	const handleSelect = (selected: Player[]) => {
		// Only add players not already selected
		const newPlayers = selected.filter((player) => !selectedPlayers.some((p) => p.id === player.id))
		setSelectedPlayers([...selectedPlayers, ...newPlayers])
		typeaheadRef.current?.clear()
		setSearchText("")
	}

	const handleRemove = (player: Player) => {
		setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id))
	}

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
				<Typeahead
					id="player-search-typeahead"
					ref={typeaheadRef}
					isLoading={isLoading}
					labelKey={(option) =>
						typeof option === "object" &&
						option !== null &&
						"firstName" in option &&
						"lastName" in option &&
						"email" in option
							? `${option.firstName} ${option.lastName} (${option.email})`
							: String(option)
					}
					minLength={minChars}
					options={options}
					placeholder="Search for players..."
					onChange={(selected) => handleSelect(selected as Player[])}
					multiple={false}
					renderMenuItemChildren={(option) =>
						typeof option === "object" &&
						option !== null &&
						"firstName" in option &&
						"lastName" in option &&
						"email" in option ? (
							<div>
								<div className="text-primary-emphasis">
									{option.firstName} {option.lastName}
								</div>
								<div className="text-muted small">
									{option.email}
								</div>
							</div>
						) : (
							<span>{String(option)}</span>
						)
					}
					onInputChange={setSearchText}
				/>
				{selectedPlayers.length > 0 && (
					<div className="mt-3 d-flex flex-wrap gap-2">
						{selectedPlayers.map((player) => (
							<span key={player.id} className="badge bg-warning text-primary-emphasis d-flex align-items-center me-2">
								<span>
									{player.firstName} {player.lastName}
								</span>
								<button
									type="button"
									className="btn btn-link btn-sm p-0 ms-2"
									onClick={() => handleRemove(player)}
									aria-label={`Remove ${player.firstName} ${player.lastName}`}
									style={{ lineHeight: 1 }}
								>
									<MdClose size={16} />
								</button>
							</span>
						))}
					</div>
				)}
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
