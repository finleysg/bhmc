import React from "react"

import { useEventRegistration } from "../../hooks/use-event-registration"
import { Course } from "../../models/course"
import { ReserveSlot, ReserveTable } from "../../models/reserve"
import { IndexTab } from "../tab/index-tab"
import { Tabs } from "../tab/tabs"
import { ReserveGrid } from "./reserve-grid"

interface ReserveViewProps {
  reserveTables: ReserveTable[]
  onReserve: (course: Course, groupName: string, slots: ReserveSlot[]) => void
  onRefresh: () => void
  onBack: () => void
}

export function ReserveView({ reserveTables, onReserve, onRefresh, onBack }: ReserveViewProps) {
  const [selectedTableIndex, updateSelectedTableIndex] = React.useState(0)
  const { error } = useEventRegistration()

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
              <button onClick={onBack} className="btn btn-link link-secondary me-2">
                Back
              </button>
            </li>
            <li>
              <button onClick={onRefresh} className="btn btn-link link-secondary">
                Refresh
              </button>
            </li>
          </Tabs>
          <ReserveGrid
            table={reserveTables[selectedTableIndex]}
            mode="edit"
            error={error}
            onReserve={onReserve}
          />
        </div>
      </div>
    </div>
  )
}
