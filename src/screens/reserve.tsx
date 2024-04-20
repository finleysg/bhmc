import { useState } from "react"

import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import { useQueryClient } from "@tanstack/react-query"

import { ReserveGrid } from "../components/reserve/reserve-grid"
import { IndexTab } from "../components/tab/index-tab"
import { Tabs } from "../components/tab/tabs"
import { useEventRegistration } from "../hooks/use-event-registration"
import { useEventRegistrationSlots } from "../hooks/use-event-registration-slots"
import { Course } from "../models/course"
import { LoadReserveTables, ReserveSlot } from "../models/reserve"
import { useCurrentEvent } from "./event-detail"

export function ReserveScreen() {
  const [selectedTableIndex, updateSelectedTableIndex] = useState(0)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { clubEvent } = useCurrentEvent()
  const { data: slots } = useEventRegistrationSlots(clubEvent.id)
  const { createRegistration, error } = useEventRegistration()

  // Simple guard.
  const currentTime = new Date()
  if (!clubEvent.paymentsAreOpen(currentTime)) {
    navigate("../")
    return null
  }

  const reserveTables = LoadReserveTables(clubEvent, slots ?? [])

  const handleReserve = async (course: Course, groupName: string, slots: ReserveSlot[]) => {
    const selectedSlots = slots.map((slot) => slot.toRegistrationSlot())
    const registationSlots = selectedSlots.filter((slot) => !slot.playerId)
    // Error triggered by Brad F. for the 2024-04-17 event indicates the create registration POST
    // included slots that had one or more players already assigned. This is not expected -- the
    // player on an available slot should always be null.
    if (registationSlots.length === 0) {
      toast.error(
        "The selected spots are not fully empty as expected. Please report this issue to secretary@bhmc.org. Try refreshing the page.",
        { delay: 7000 },
      )
      return
    } else if (registationSlots.length !== selectedSlots.length) {
      toast.warn(
        "The selected spots are not fully empty as expected. Please report this issue to secretary@bhmc.org.",
      )
    }
    await createRegistration(
      course,
      registationSlots,
      `${clubEvent.name}: ${course.name} ${groupName}`,
    )
    navigate("../register", { replace: true })
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["event-registration-slots", clubEvent.id] })
  }

  return (
    <div className="row">
      <div className="col-12">
        <div>
          <Tabs>
            {reserveTables.map((table, index) => {
              return (
                <IndexTab
                  key={table.course.id}
                  index={index}
                  selectedIndex={selectedTableIndex}
                  onSelect={(i: number) => updateSelectedTableIndex(i)}
                >
                  {table.course.name}
                </IndexTab>
              )
            })}
            <li className="flex-grow-1">&nbsp;</li>
            <li>
              <button onClick={() => navigate(-1)} className="btn btn-link link-secondary me-2">
                Back
              </button>
            </li>
            <li>
              <button onClick={handleRefresh} className="btn btn-link link-secondary">
                Refresh
              </button>
            </li>
          </Tabs>
          <ReserveGrid
            table={reserveTables[selectedTableIndex]}
            mode="edit"
            error={error}
            onReserve={handleReserve}
          />
        </div>
      </div>
    </div>
  )
}
