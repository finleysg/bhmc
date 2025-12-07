// src/components/event-registration/edit-registration-modal.tsx

import { Modal } from "../dialog/modal"

export type EditRegistrationAction = "addPlayers" | "dropPlayers" | "moveGroup" | "replacePlayer" | "updateRegistration"

export interface EditRegistrationModalProps {
	show: boolean
	onClose: () => void
	onAction: (action: EditRegistrationAction) => void
}

const OPTIONS: {
	key: EditRegistrationAction
	title: string
	description: string
}[] = [
	{
		key: "addPlayers",
		title: "Add Players",
		description: "Add one or more players to your group, assuming there is space available",
	},
	{
		key: "dropPlayers",
		title: "Drop Players",
		description:
			"Drop one or more players from your group. A refund will be triggered so long as you're within the refund period.",
	},
	{
		key: "moveGroup",
		title: "Move Group",
		description: "Move your group to another open spot.",
	},
	{
		key: "replacePlayer",
		title: "Replace Player",
		description: "Replace one of the players in your group with another player.",
	},
	{
		key: "updateRegistration",
		title: "Update Registration",
		description: "Pay for skins, greens fees, and/or carts.",
	},
]

export function EditRegistrationModal({ show, onClose, onAction }: EditRegistrationModalProps) {
	return (
		<Modal show={show} onClose={onClose}>
			<div className="modal-header">
				<h5 className="modal-title text-primary">Edit Registration</h5>
				<button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
			</div>
			<div className="modal-body">
				<ul className="list-group">
					{OPTIONS.map((opt) => (
						<li key={opt.key} className="list-group-item border-0">
							<button
								type="button"
								className="btn btn-link text-success ps-0"
								style={{ textDecoration: "none" }}
								onClick={() => onAction(opt.key)}
							>
								{opt.title}
							</button>
							<div className="text-muted fst-italic small mt-1">{opt.description}</div>
						</li>
					))}
				</ul>
			</div>
		</Modal>
	)
}
