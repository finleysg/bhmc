import { useState } from "react"

import { toast } from "react-toastify"

import { ErrorDisplay } from "../../components/feedback/error-display"
import { OverlaySpinner } from "../../components/spinners/overlay-spinner"
import { useDropPlayers } from "../../hooks/use-drop-players"
import { useEventRegistrations } from "../../hooks/use-event-registrations"
import { useIssueRefunds } from "../../hooks/use-issue-refunds"
import { useRegisterPlayer } from "../../hooks/use-register-player"
import { useSwapPlayers } from "../../hooks/use-swap-players"
import { ClubEventProps } from "../../models/common-props"
import { RefundData } from "../../models/refund"
import { ReserveSlot } from "../../models/reserve"
import { ReserveListAdmin } from "./reserve-list"

export function ReserveManager2({ clubEvent }: ClubEventProps) {
  const [busy, setBusy] = useState(false)
  const { data: registrations, status, error } = useEventRegistrations(clubEvent.id)
  const {
    mutateAsync: registerPlayer,
    status: registerStatus,
    error: registerError,
  } = useRegisterPlayer(clubEvent.id)
  const { mutateAsync: dropPlayers, status: dropStatus, error: dropError } = useDropPlayers()
  const { mutateAsync: swapPlayers, status: swapStatus, error: swapError } = useSwapPlayers()
  const issueRefunds = useIssueRefunds()

  const handleRegister = async (
    slot: ReserveSlot,
    playerId: number,
    feeIds: number[],
    notes: string,
  ) => {
    await registerPlayer({ playerId, fees: feeIds, slotId: slot.id, notes })
    toast.success("Player registration was successful.")
  }

  const handleDrop = async (
    registrationId: number,
    slotIds: number[],
    refunds: Map<number, RefundData>,
  ) => {
    try {
      setBusy(true)
      await issueRefunds(refunds)
      await dropPlayers({ registrationId, slotIds })
      toast.success("Player drop was successful.")
    } finally {
      setBusy(false)
    }
  }

  const handleSwap = async (slot: ReserveSlot, newPlayerId: number) => {
    await swapPlayers({
      slotId: slot.id,
      playerId: newPlayerId,
    })
    toast.success("Player swap was successful.")
  }

  return (
    <div>
      <OverlaySpinner
        loading={
          busy ||
          status === "pending" ||
          dropStatus === "pending" ||
          swapStatus === "pending" ||
          registerStatus === "pending"
        }
      />
      {error && <ErrorDisplay error={error.message} delay={5000} />}
      {dropError && <ErrorDisplay error={dropError.message} delay={5000} />}
      {swapError && <ErrorDisplay error={swapError.message} delay={5000} />}
      {registerError && <ErrorDisplay error={registerError.message} delay={5000} />}
      <ReserveListAdmin
        clubEvent={clubEvent}
        registrations={registrations ?? []}
        onRegister={handleRegister}
        onDrop={handleDrop}
        onSwap={handleSwap}
      />
    </div>
  )
}
