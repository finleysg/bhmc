import { parse } from "date-fns"
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom"

import { OverlaySpinner } from "../components/spinners/overlay-spinner"
import { EventRegistrationProvider } from "../context/registration-context"
import { useClubEvents } from "../hooks/use-club-events"
import { ClubEvent } from "../models/club-event"

export type ClubEventContextType = { clubEvent: ClubEvent }

export function EventDetailScreen() {
	const { eventDate, eventName } = useParams()
	const navigate = useNavigate()

	const startDate = eventDate ? parse(eventDate, "yyyy-MM-dd", new Date()) : new Date()
	const { data: clubEvents } = useClubEvents(startDate.getFullYear())
	const { found, clubEvent } = ClubEvent.getClubEvent(clubEvents, eventDate, eventName)

	if (!eventDate || !eventName) {
		navigate("/home")
	}

	return (
		<div className="content__inner">
			<OverlaySpinner loading={!found} />
			{clubEvent && (
				<EventRegistrationProvider clubEvent={clubEvent}>
					<Outlet context={{ clubEvent } satisfies ClubEventContextType} />
				</EventRegistrationProvider>
			)}
		</div>
	)
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCurrentEvent() {
	return useOutletContext<ClubEventContextType>()
}
