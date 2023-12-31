import { PropsWithChildren, useEffect, useRef } from "react"

interface DialogProps {
  title?: string
  show: boolean
  onClose: () => void
}

export function Dialog({ children, title, show, onClose }: PropsWithChildren<DialogProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (show && !dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  }, [show])

  const closeDialog = () => {
    dialogRef.current?.close()
    onClose()
  }

  return (
    <dialog className="border-0" ref={dialogRef}>
      <div className="card border-0">
        <div className="card-body">
          {title ?? <h3 className="card-title text-primary">{title}</h3>}
          {children}
        </div>
        <div className="card-footer">
          <button type="button" className="btn btn-sm btn-primary" onClick={closeDialog}>
            Ok
          </button>
        </div>
      </div>
    </dialog>
  )
}
