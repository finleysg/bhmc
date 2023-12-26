import { ComponentPropsWithoutRef } from "react"

import { ReserveGroup, ReserveSlot } from "../../models/reserve"
import { ReserveCard } from "./reserve-card"

interface ReserveRowProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  courseName: string
  group: ReserveGroup
  mode: "view" | "edit"
  onSelect: (slot: ReserveSlot[]) => void
  onReserve: (groupName: string) => void
}

export function ReserveRow({
  courseName,
  group,
  mode,
  onSelect,
  onReserve,
  ...rest
}: ReserveRowProps) {
  return (
    <div className={`reserve-group reserve-group__${courseName.toLowerCase()}`} {...rest}>
      <div className={mode === "edit" ? "reserve-group-name" : "reserved-group-name"}>
        <span>{group.name}</span>
        {mode === "edit" && (
          <>
            <button
              className="btn btn-sm btn-info"
              disabled={!group.hasOpenings()}
              onClick={() => onSelect(group.slots)}
            >
              Select
            </button>
            <button
              className="btn btn-sm btn-warning"
              disabled={group.isDisabled()}
              onClick={() => onReserve(group.name)}
            >
              Register
            </button>
          </>
        )}
      </div>
      {group.slots.map((slot) => (
        <ReserveCard key={slot.id} reserveSlot={slot} onSelect={(slot) => onSelect([slot])} />
      ))}
    </div>
  )
}
