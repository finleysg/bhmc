import { ComponentPropsWithoutRef } from "react"

import { ReserveSlot } from "../../models/reserve"

interface ReserveCardProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  reserveSlot: ReserveSlot
  onSelect: (slot: ReserveSlot) => void
}

export function ReserveCard({ reserveSlot, onSelect, ...rest }: ReserveCardProps) {
  const handleSelect = () => {
    if (reserveSlot.canSelect()) {
      onSelect(reserveSlot)
    }
  }

  const deriveClasses = () => {
    const className = "reserve-slot"
    if (reserveSlot.selected) {
      return className + " reserve-slot__selected"
    }
    return className + ` reserve-slot__${reserveSlot.statusName.toLowerCase().replace(" ", "-")}`
  }

  return (
    <div
      className={deriveClasses()}
      role="button"
      onClick={handleSelect}
      onKeyDown={handleSelect}
      tabIndex={0}
      {...rest}
    >
      <span>{reserveSlot.displayText()}</span>
    </div>
  )
}
