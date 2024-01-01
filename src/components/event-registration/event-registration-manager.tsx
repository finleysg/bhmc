import { useEffect, useState } from "react"

import { useQueryClient } from "@tanstack/react-query"

import { RegistrationMode } from "../../context/registration-reducer"
import { useEventRegistration } from "../../hooks/use-event-registration"
import { useEventRegistrationSlots } from "../../hooks/use-event-registration-slots"
import { useMyPlayerRecord } from "../../hooks/use-my-player-record"
import { ClubEvent } from "../../models/club-event"
import { Course } from "../../models/course"
import { LoadReserveTables, ReserveSlot } from "../../models/reserve"
import { EventView } from "../events/event-view"
import { ReserveView } from "../reserve/reserve-view"
import { RegisterView } from "./register-view"

export function EventRegistrationManager({ clubEvent }: { clubEvent: ClubEvent }) {
  const [currentView, setCurrentView] = useState("event-view")
  const [mode, setMode] = useState<RegistrationMode>("new")
  const [selectedStart, setSelectedStart] = useState("")

  const queryClient = useQueryClient()
  const { createRegistration, loadRegistration, loadEvent } = useEventRegistration()
  const { data: slots } = useEventRegistrationSlots(clubEvent.id)
  const { data: player } = useMyPlayerRecord()

  useEffect(() => {
    loadEvent(clubEvent)
    // return () => completeRegistration()
  }, [clubEvent, loadEvent])

  const handleStart = () => {
    if (clubEvent.canChoose) {
      setCurrentView("reserve-view")
    } else {
      createRegistration(undefined, [], () => {
        setSelectedStart(clubEvent.name)
        setCurrentView("register-view")
      })
    }
  }

  const handleEdit = () => {
    if (player) {
      loadRegistration(player).then(() => {
        setMode("edit")
        setCurrentView("register-view")
      })
    }
  }

  const handleReserve = (course: Course, groupName: string, slots: ReserveSlot[]) => {
    const registationSlots = slots.map((slot) => slot.toRegistrationSlot())
    createRegistration(course, registationSlots, () => {
      setSelectedStart(`${clubEvent.name}: ${course.name} ${groupName}`)
      setCurrentView("register-view")
    })
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["event-registration-slots", clubEvent.id] })
  }

  const handleCancel = () => {
    setCurrentView("event-view")
  }

  if (currentView === "event-view") {
    return (
      <EventView clubEvent={clubEvent} onRegister={handleStart} onEditRegistration={handleEdit} />
    )
  } else if (currentView === "reserve-view") {
    const reserveTables = LoadReserveTables(clubEvent, slots ?? [])
    return (
      <ReserveView
        reserveTables={reserveTables}
        onReserve={handleReserve}
        onRefresh={handleRefresh}
        onBack={() => setCurrentView("event-view")}
      />
    )
  } else if (currentView === "register-view") {
    return <RegisterView selectedStart={selectedStart} onCancel={handleCancel} mode={mode} />
  }
}
