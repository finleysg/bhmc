import { useState } from "react"

import { useNavigate } from "react-router-dom"
import { useInterval } from "usehooks-ts"

import { ReserveGrid } from "../components/reserve/reserve-grid"
import { IndexTab } from "../components/tab/index-tab"
import { Tabs } from "../components/tab/tabs"
import { useEventRegistration } from "../hooks/use-event-registration"
import { useEventRegistrationSlots } from "../hooks/use-event-registration-slots"
import { Course } from "../models/course"
import { LoadReserveTables, ReserveSlot, ReserveTable } from "../models/reserve"
import { useCurrentEvent } from "./event-detail"

export function ReserveScreen() {
  const [selectedTableIndex, updateSelectedTableIndex] = useState(0)
  const [reserveTables, setReserveTables] = useState<ReserveTable[]>([])

  const navigate = useNavigate()

  const { clubEvent } = useCurrentEvent()
  const { data: slots } = useEventRegistrationSlots(clubEvent.id)
  const { createRegistration, error } = useEventRegistration()

  useInterval(() => {
    loadTables()
  }, 10 * 1000)

  // Simple guard.
  const currentTime = new Date()
  if (!clubEvent.paymentsAreOpen(currentTime)) {
    navigate("../")
    return null
  }

  const loadTables = () => {
    const tables = LoadReserveTables(clubEvent, slots ?? [])
    setReserveTables(tables)
  }

  if (reserveTables.length === 0) {
    setTimeout(() => {
      loadTables()
    }, 100)
  }

  const handleReserve = async (course: Course, groupName: string, slots: ReserveSlot[]) => {
    const selectedSlots = slots.map((slot) => slot.toRegistrationSlot())
    const registationSlots = selectedSlots.filter((slot) => !slot.playerId)

    await createRegistration(
      course,
      registationSlots,
      `${clubEvent.name}: ${course.name} ${groupName}`,
    )
    navigate("../register", { replace: true })
  }

  const currentWave = () => {
    const isPriorityPeriod = clubEvent.priorityRegistrationIsOpen()
    if (isPriorityPeriod) {
      const currentMinute = currentTime.getMinutes()
      if (currentMinute < 15) {
        return 1
      } else if (currentMinute < 30) {
        return 2
      } else if (currentMinute < 45) {
        return 3
      }
      return 4
    }
    return 0
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
              <button onClick={() => navigate(-1)} className="btn btn-sm btn-secondary me-2">
                Back
              </button>
            </li>
            <li>
              <button onClick={loadTables} className="btn btn-sm btn-primary">
                Refresh
              </button>
            </li>
          </Tabs>
          <ReserveGrid
            table={reserveTables[selectedTableIndex]}
            mode="edit"
            error={error}
            wave={currentWave()}
            onReserve={handleReserve}
          />
        </div>
      </div>
    </div>
  )
}
