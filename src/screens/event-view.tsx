import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import { EventDocuments } from "../components/document/event-documents"
import { EventDetail } from "../components/events/event-detail"
import { EventPhotos } from "../components/events/event-photos"
import { FeesAndPoints } from "../components/events/fees-and-points"
import { RegisterStep, ReserveStep } from "../context/registration-reducer"
import { useEventRegistration } from "../hooks/use-event-registration"
import { useMyPlayerRecord } from "../hooks/use-my-player-record"
import { usePlayerRegistrations } from "../hooks/use-player-registrations"
import { useAddPlayersToRegistration } from "../hooks/use-registration-update"
import { useCurrentEvent } from "./event-detail"
import { EditRegistrationModal, EditRegistrationAction } from "../components/event-registration/edit-registration-modal"
import { PlayerSearchModal } from "../components/event-registration/player-search-modal"
import type { Player } from "../models/player"

export function EventViewScreen() {
	const { clubEvent } = useCurrentEvent()
	const { createRegistration, initiateStripeSession, loadRegistration, updateStep } = useEventRegistration()
	const { data: player } = useMyPlayerRecord()
	const { data: myRegistrations } = usePlayerRegistrations(player?.id)
	const { mutateAsync: addPlayers } = useAddPlayersToRegistration()
	const navigate = useNavigate()
	const [showEditModal, setShowEditModal] = useState(false)
	const [showPlayerSearch, setShowPlayerSearch] = useState(false)

	const handleStart = async () => {
		initiateStripeSession()
		if (clubEvent.canChoose) {
			updateStep(ReserveStep)
			navigate("reserve")
		} else {
			try {
				await createRegistration(undefined, [], undefined)
				updateStep(RegisterStep)
				navigate("register")
			} catch (error: unknown) {
				toast.error(error instanceof Error ? error.message : "Failed to start registration")
			}
		}
	}

	const handleEdit = () => {
		setShowEditModal(true)
	}

	const handleEditAction = async (action: EditRegistrationAction) => {
		setShowEditModal(false)
		if (action === "updateRegistration") {
			if (player) {
				await loadRegistration(player)
				navigate("edit")
			}
		} else if (action === "addPlayers") {
			setShowPlayerSearch(true)
		} else {
			// Placeholder for other actions
			console.log("Selected action:", action)
		}
	}

	const handlePlayerSearchConfirm = async (players: Player[]) => {
		setShowPlayerSearch(false)
		const registration = myRegistrations?.find((r) => r.eventId === clubEvent.id)
		if (registration && players.length > 0) {
			await addPlayers({
				registrationId: registration.id,
				playerIds: players.map((p) => p.id),
			})
			navigate("edit")
		}
	}

	const handlePlayerSearchClose = () => {
		setShowPlayerSearch(false)
	}

	return (
		<>
			<EditRegistrationModal show={showEditModal} onClose={() => setShowEditModal(false)} onAction={handleEditAction} />
<PlayerSearchModal
  show={showPlayerSearch}
  onClose={handlePlayerSearchClose}
  onConfirm={handlePlayerSearchConfirm}
  clubEvent={clubEvent}
/>
			<div className="row">
				<div className="col-md-8">
					<EventDetail clubEvent={clubEvent} onRegister={handleStart} onEditRegistration={handleEdit} />
				</div>
				<div className="col-md-4">
					<FeesAndPoints clubEvent={clubEvent} />
					<EventDocuments clubEvent={clubEvent} />
					<EventPhotos clubEvent={clubEvent} />
				</div>
			</div>
		</>
	)
}
