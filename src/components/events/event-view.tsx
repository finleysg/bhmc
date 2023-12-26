import { EventType } from "../../models/codes"
import { EventDocuments } from "../document/event-documents"
import { EventDetail, EventDetailProps } from "./event-detail"
import { EventPhotos } from "./event-photos"
import { FeesAndPoints } from "./fees-and-points"
import { SeasonEventDetail } from "./season-event-detail"

export function EventView({ clubEvent, onRegister, onEditRegistration }: EventDetailProps) {
  return (
    <div className="row">
      <div className="col-md-8">
        {clubEvent.eventType === EventType.Membership && (
          <SeasonEventDetail clubEvent={clubEvent} onRegister={onRegister} />
        )}
        {clubEvent.eventType !== EventType.Membership && (
          <EventDetail
            clubEvent={clubEvent}
            onRegister={onRegister}
            onEditRegistration={onEditRegistration}
          />
        )}
      </div>
      <div className="col-md-4">
        <FeesAndPoints clubEvent={clubEvent} />
        <EventDocuments clubEvent={clubEvent} />
        <EventPhotos clubEvent={clubEvent} />
      </div>
    </div>
  )
}
