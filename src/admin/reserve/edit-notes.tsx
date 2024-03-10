import { ChangeEvent, useEffect, useState } from "react"

interface EditNotesProps {
  registrationNotes: string
  signedUpBy: string
  onEdit: (notes: string) => void
  onCancel: () => void
}

export function EditNotes({ registrationNotes, signedUpBy, onEdit, onCancel }: EditNotesProps) {
  const [notes, setNotes] = useState("")

  useEffect(() => {
    setNotes(registrationNotes)
  }, [registrationNotes])

  const handleCancel = () => {
    setNotes(registrationNotes ?? "")
    onCancel()
  }

  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const notes = e.target.value
    setNotes(notes)
  }

  const handleEdit = () => {
    onEdit(notes)
  }

  return (
    <div className="card border border-info">
      <div className="card-body">
        <h4 className="card-header text-info mb-2">Edit Registration Notes</h4>
        <p className="mt-2 fw-bold text-info-emphasis">Registering player: {signedUpBy}</p>
        <div className="form-group mb-2">
          <label htmlFor="notes">Notes / Player Requests</label>
          <textarea
            id="notes"
            name="notes"
            className="form-control fc-alt"
            value={notes}
            onChange={handleNotesChange}
            rows={5}
          ></textarea>
        </div>
        <div className="card-footer d-flex justify-content-end pb-0">
          <button className="btn btn-light btn-sm me-2 mt-2" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-info btn-sm mt-2" onClick={handleEdit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
