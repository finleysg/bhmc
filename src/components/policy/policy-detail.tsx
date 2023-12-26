import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { PolicyProps } from "../../models/policy"

export function PolicyDetail({ policy }: PolicyProps) {
  const { title, description } = policy
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-header mb-2">{title}</h5>
        <div className="card-text">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
