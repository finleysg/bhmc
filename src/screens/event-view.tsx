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
import { useMovePlayers } from "../hooks/use-move-players"
import { useSwapPlayers } from "../hooks/use-swap-players"
import { useCurrentEvent } from "./event-detail"
import { EditRegistrationModal, EditRegistrationAction } from "../components/event-registration/edit-registration-modal"
import { MoveGroupModal } from "../components/event-registration/move-group-modal"
import { PlayerSearchModal } from "../components/event-registration/player-search-modal"
import { ReplacePlayerModal } from "../components/event-registration/replace-player-modal"
import type { Player } from "../models/player"

export function EventViewScreen() {
	const { clubEvent } = useCurrentEvent()
	const { createRegistration, editRegistration, initiateStripeSession, loadRegistration, registration, updateStep } =
		useEventRegistration()
	const { data: player } = useMyPlayerRecord()
	const { data: myRegistrations } = usePlayerRegistrations(player?.id, clubEvent.season)
	const navigate = useNavigate()
	const movePlayers = useMovePlayers()
	const swapPlayers = useSwapPlayers()
	const [availableSlots, setAvailableSlots] = useState<number>(0)
	const [showEditModal, setShowEditModal] = useState(false)
	const [showMoveGroup, setShowMoveGroup] = useState(false)
	const [showPlayerSearch, setShowPlayerSearch] = useState(false)
	const [showReplacePlayer, setShowReplacePlayer] = useState(false)

	const deriveAvailableSlots = () => {
		const currentSlots = registration?.slots.filter((slot) => slot.playerId).length ?? 0
		if (clubEvent.canChoose) {
			setAvailableSlots(currentSlots)
			return currentSlots
		} else {
			setAvailableSlots((clubEvent.maximumSignupGroupSize ?? 0) - currentSlots)
			return (clubEvent.maximumSignupGroupSize ?? 0) - currentSlots
		}
	}

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
				initiateStripeSession()
				navigate("edit")
			}
		} else if (action === "addPlayers") {
			await loadRegistration(player!)
			const available = deriveAvailableSlots()
			if (available <= 0) {
				toast.info("No available slots to add players.")
				return
			}
			setShowPlayerSearch(true)
		} else if (action === "replacePlayer") {
			setShowReplacePlayer(true)
		} else if (action === "moveGroup") {
			setShowMoveGroup(true)
		} else {
			// Placeholder for other actions
			console.log("Selected action:", action)
		}
	}

	const handlePlayerSearchConfirm = async (players: Player[]) => {
		setShowPlayerSearch(false)
		const registration = myRegistrations?.find((r) => r.eventId === clubEvent.id)
		if (registration && players.length > 0) {
			await editRegistration(
				registration.id,
				players.map((p) => p.id),
			)
			initiateStripeSession()
			navigate("edit")
		}
	}

	const handlePlayerSearchClose = () => {
		setShowPlayerSearch(false)
	}

	const handleReplacePlayer = async (sourcePlayerId: number, targetPlayerId: number) => {
		setShowReplacePlayer(false)
		const registration = myRegistrations?.find((r) => r.eventId === clubEvent.id)
		const slot = registration?.slots.find((s) => s.playerId === sourcePlayerId)
		if (slot) {
			try {
				await swapPlayers.mutateAsync({ slotId: slot.id, playerId: targetPlayerId })
				toast.success("Player replaced")
			} catch (error: unknown) {
				toast.error(error instanceof Error ? error.message : "Failed to replace player")
			}
		}
	}

	const handleMoveGroup = async (destinationSlotIds: number[]) => {
		setShowMoveGroup(false)
		const registration = myRegistrations?.find((r) => r.eventId === clubEvent.id)
		if (registration) {
			try {
				await movePlayers.mutateAsync({
					registrationId: registration.id,
					sourceSlotIds: registration.slots.map((s) => s.id),
					destinationSlotIds,
				})
				toast.success("Group moved")
			} catch (error: unknown) {
				toast.error(error instanceof Error ? error.message : "Failed to move group")
			}
		}
	}

	return (
		<>
			<EditRegistrationModal show={showEditModal} onClose={() => setShowEditModal(false)} onAction={handleEditAction} />
			<PlayerSearchModal
				show={showPlayerSearch}
				onClose={handlePlayerSearchClose}
				onConfirm={handlePlayerSearchConfirm}
				clubEvent={clubEvent}
				availableSlots={availableSlots}
			/>
			{myRegistrations?.find((r) => r.eventId === clubEvent.id) && (
				<ReplacePlayerModal
					show={showReplacePlayer}
					onClose={() => setShowReplacePlayer(false)}
					onReplace={handleReplacePlayer}
					registration={myRegistrations.find((r) => r.eventId === clubEvent.id)!}
					clubEvent={clubEvent}
				/>
			)}
			{myRegistrations?.find((r) => r.eventId === clubEvent.id) && (
				<MoveGroupModal
					show={showMoveGroup}
					onClose={() => setShowMoveGroup(false)}
					onMove={handleMoveGroup}
					registration={myRegistrations.find((r) => r.eventId === clubEvent.id)!}
					clubEvent={clubEvent}
				/>
			)}
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
