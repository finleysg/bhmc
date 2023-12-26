import React, { useState } from "react"

import { useEventRegistrationSlots } from "../../hooks/use-event-registration-slots"
import { ClubEventProps } from "../../models/common-props"
import { LoadReserveTables } from "../../models/reserve"
import { OverlaySpinner } from "../spinners/overlay-spinner"
import { IndexTab } from "../tab/index-tab"
import { Tabs } from "../tab/tabs"
import { ReserveGrid } from "./reserve-grid"

export function ReservedGrid({ clubEvent }: ClubEventProps) {
  const [selectedTableIndex, updateSelectedTableIndex] = useState(0)
  const { data: slots } = useEventRegistrationSlots(clubEvent.id)

  const reserveTables = LoadReserveTables(clubEvent, slots ?? [])

  return (
    <div className="row">
      <div className="col-12">
        <div>
          <OverlaySpinner loading={!reserveTables[0]} />
          {Boolean(reserveTables[0]) && (
            <React.Fragment>
              <Tabs>
                {reserveTables.map((table, index) => {
                  return (
                    <IndexTab
                      key={table.course.id}
                      index={index}
                      selectedIndex={selectedTableIndex}
                      onSelect={(i) => updateSelectedTableIndex(i)}
                    >
                      {table.course.name}
                    </IndexTab>
                  )
                })}
              </Tabs>
              <ReserveGrid
                mode="view"
                table={reserveTables[selectedTableIndex]}
                error={null}
                onReserve={() => {
                  throw new Error("This view is readonly.")
                }}
              />
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  )
}
