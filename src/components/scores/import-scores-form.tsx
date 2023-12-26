import { FormEvent, useState } from "react"

import { FilePicker } from "../document/file-picker"

interface ImportScoresFormProps {
  onSubmit: (file: File) => void
}

export function ImportScoresForm({ onSubmit }: ImportScoresFormProps) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [files, setFiles] = useState<File[]>([])

  const handleFileSelected = (files: File[]) => {
    setFiles(files)
  }

  const handleFileSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(files[0])
    setFiles([])
    setRefreshKey(refreshKey + 1)
  }

  return (
    <div>
      <form onSubmit={handleFileSubmit}>
        <FilePicker key={refreshKey} onSelected={handleFileSelected} onDrop={handleFileSelected} />
        <div className="d-flex justify-content-end mt-2">
          <button type="submit" className="btn btn-primary ms-2" disabled={files.length === 0}>
            Import Scores
          </button>
        </div>
      </form>
    </div>
  )
}
