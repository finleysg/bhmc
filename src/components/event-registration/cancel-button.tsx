import { useState } from "react"

import { useNavigate } from "react-router-dom"

import { RegistrationMode } from "../../context/registration-reducer"
import { useEventRegistration } from "../../hooks/use-event-registration"
import { ConfirmDialog } from "../dialog/confirm"

export function CancelButton({ mode }: { mode: RegistrationMode }) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const { cancelRegistration, currentStep } = useEventRegistration()
  const navigate = useNavigate()

  const dialogTitle = mode === "new" ? "Cancel Registration?" : "Cancel Changes?"
  const dialogMessage =
    mode === "new"
      ? "Cancel this registration and return to the event detail page."
      : "Cancel these changes and return to the event detail page."

  const handleCancel = async () => {
    setShowCancelDialog(false)
    await cancelRegistration("user", mode)
    if (currentStep.name === "payment") {
      navigate("../../")
    } else {
      navigate("../")
    }
  }

  return (
    <>
      <button className="btn btn-secondary ms-2" onClick={() => setShowCancelDialog(true)}>
        Cancel
      </button>
      <ConfirmDialog
        show={showCancelDialog}
        title={dialogTitle}
        message={dialogMessage}
        onClose={(result) => (result ? handleCancel() : setShowCancelDialog(false))}
      />
    </>
  )
}
