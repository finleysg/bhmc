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
import { useCurrentEvent } from "./event-detail"
import { EditRegistrationModal, EditRegistrationAction } from "../components/event-registration/edit-registration-modal"

export function EventViewScreen() {
	const { clubEvent } = useCurrentEvent()
	const { createRegistration, initiateStripeSession, loadRegistration, updateStep } = useEventRegistration()
	const { data: player } = useMyPlayerRecord()
	const navigate = useNavigate()
	const [showEditModal, setShowEditModal] = useState(false)

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
		} else {
			// Placeholder for other actions
			console.log("Selected action:", action)
		}
	}

	return (
		<>
			<EditRegistrationModal show={showEditModal} onClose={() => setShowEditModal(false)} onAction={handleEditAction} />
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
