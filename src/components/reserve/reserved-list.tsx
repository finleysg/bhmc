import { useAuth } from "../../hooks/use-auth"
import { useEventRegistrations } from "../../hooks/use-event-registrations"
import { ClubEventProps } from "../../models/common-props"
import { ConvertRegistrationsToReservations } from "../../models/reserve"
import { OverlaySpinner } from "../spinners/overlay-spinner"
import { ReservedPlayer } from "./reserved-player"

export function ReservedList({ clubEvent }: ClubEventProps) {
	const { user } = useAuth()
	const { data: registrations, status, fetchStatus } = useEventRegistrations(clubEvent.id)

	const reservations = ConvertRegistrationsToReservations(registrations ?? [])

	return (
		<div className="card">
			<div className="card-body">
				<h3 className="card-title text-primary">{clubEvent.name}</h3>
				<div className="card-text">
					<div className="row">
						<OverlaySpinner loading={status === "pending" || fetchStatus === "fetching"} />
						{registrations && registrations.length > 0 ? (
							<div>
								{reservations.map((p) => {
									return <ReservedPlayer key={p.playerId} playerRegistration={p} isLink={user.isAuthenticated} />
								})}
							</div>
						) : (
							<p>No sign ups yet.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
