import { useState } from "react"

import { useNavigate } from "react-router-dom"

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

  const reserveTables = LoadReserveTables(clubEvent, slots ?? [])

  const handleReserve = async (course: Course, groupName: string, slots: ReserveSlot[]) => {
    const registationSlots = slots.map((slot) => slot.toRegistrationSlot())
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
