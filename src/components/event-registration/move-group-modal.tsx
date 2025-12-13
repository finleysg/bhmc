import { useState } from "react"

import { Modal } from "../dialog/modal"
import { CourseSelector } from "../course-selector/course-selector"
import { AvailableSpotsSelector } from "./available-spots-selector"
import type { AvailableGroup } from "../../models/available-group"
import type { ClubEvent } from "../../models/club-event"
import type { Course } from "../../models/course"
import type { Registration } from "../../models/registration"

interface MoveGroupModalProps {
	show: boolean
	onClose: () => void
	onMove: (destinationSlotIds: number[]) => void
	registration: Registration
	clubEvent: ClubEvent
}

export function MoveGroupModal({ show, onClose, onMove, registration, clubEvent }: MoveGroupModalProps) {
	const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined)
	const [selectedGroup, setSelectedGroup] = useState<AvailableGroup | undefined>(undefined)

	const playerCount = registration.slots.filter((s) => s.playerId).length

	const handleCourseChange = (course: Course) => {
		setSelectedCourse(course)
		setSelectedGroup(undefined)
	}

	const handleGroupChange = (group: AvailableGroup | undefined) => {
		setSelectedGroup(group)
	}

	const handleMove = () => {
		if (selectedGroup) {
			onMove(selectedGroup.slots.map((s) => s.id))
		}
	}

	const handleClose = () => {
		setSelectedCourse(undefined)
		setSelectedGroup(undefined)
		onClose()
	}

	const canMove = selectedGroup !== undefined

	return (
		<Modal show={show} onClose={handleClose}>
			<div className="modal-header mb-4">
				<h5 className="modal-title text-primary">Move Group</h5>
				<button type="button" className="btn-close" aria-label="Close" onClick={handleClose} />
			</div>
			<div className="modal-body">
				<div className="mb-4">
					<div className="form-label fw-semibold">Select Course</div>
					<CourseSelector
						courses={clubEvent.courses}
						selectedCourse={selectedCourse}
						onChange={handleCourseChange}
					/>
				</div>
				{selectedCourse && (
					<div>
						<div className="form-label fw-semibold">Select Starting Spot</div>
						<AvailableSpotsSelector
							eventId={clubEvent.id}
							courseId={selectedCourse.id}
							playerCount={playerCount}
							clubEvent={clubEvent}
							value={selectedGroup}
							onChange={handleGroupChange}
						/>
					</div>
				)}
			</div>
			<div className="modal-footer">
				<button type="button" className="btn btn-sm btn-light me-2 mt-2" onClick={handleClose}>
					Cancel
				</button>
				<button type="button" className="btn btn-sm btn-primary mt-2" onClick={handleMove} disabled={!canMove}>
					Move
				</button>
			</div>
		</Modal>
	)
}
