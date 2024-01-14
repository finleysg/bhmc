import { useEffect } from "react"

import { useNavigate } from "react-router-dom"

import { EventDocuments } from "../components/document/event-documents"
import { EventDetail } from "../components/events/event-detail"
import { EventPhotos } from "../components/events/event-photos"
import { FeesAndPoints } from "../components/events/fees-and-points"
import { RegisterStep, ReserveStep } from "../context/registration-reducer"
import { useEventRegistration } from "../hooks/use-event-registration"
import { useMyPlayerRecord } from "../hooks/use-my-player-record"
import { useCurrentEvent } from "./event-detail"

export function EventViewScreen() {
  const { clubEvent } = useCurrentEvent()
  const { createRegistration, loadEvent, loadRegistration, updateStep } = useEventRegistration()
  const { data: player } = useMyPlayerRecord()
  const navigate = useNavigate()

  useEffect(() => {
    loadEvent(clubEvent)
  }, [clubEvent, loadEvent])

  const handleStart = () => {
    if (clubEvent.canChoose) {
      updateStep(ReserveStep)
      navigate("reserve")
    } else {
      createRegistration(undefined, [], undefined, () => {
        updateStep(RegisterStep)
        navigate("register")
      })
    }
  }

  const handleEdit = () => {
    if (player) {
      loadRegistration(player).then(() => {
        navigate("edit")
      })
    }
  }

  return (
    <div className="row">
      <div className="col-md-8">
        <EventDetail
          clubEvent={clubEvent}
          onRegister={handleStart}
          onEditRegistration={handleEdit}
        />
      </div>
      <div className="col-md-4">
        <FeesAndPoints clubEvent={clubEvent} />
        <EventDocuments clubEvent={clubEvent} />
        <EventPhotos clubEvent={clubEvent} />
      </div>
    </div>
  )
}
