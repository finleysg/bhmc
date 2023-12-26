import { useCallback, useRef, useState } from "react"

import { usePagingData } from "../../hooks/use-paging-data"
import { Photo, PhotoApiSchema } from "../../models/photo"
import { OverlaySpinner } from "../spinners/overlay-spinner"
import { SmallPhoto } from "./small-photo"

interface PhotoGalleryProps {
  tag?: string
}

export function PhotoGallery({ tag }: PhotoGalleryProps) {
  const [url, setUrl] = useState(() => {
    if (tag) {
      return `photos/?page=1&tags=${tag}`
    } else {
      return "photos/?page=1"
    }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { results, next, loading } = usePagingData<any>(url, PhotoApiSchema)
  const loader = useRef<IntersectionObserver>()

  const lastPhotoRef = useCallback(
    (node: HTMLLIElement) => {
      if (loading) return
      if (loader.current) loader.current.disconnect()
      loader.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && next) {
            setUrl(next)
          }
        },
        {
          root: null,
          rootMargin: "20px",
          threshold: 0,
        },
      )
      if (node) {
        loader.current.observe(node)
      }
    },
    [loading, next],
  )

  return (
    <ul style={{ listStyle: "none" }}>
      {results?.map((pic, index) => {
        if (results.length === index + 1) {
          return (
            <li key={pic.id} ref={lastPhotoRef} style={{ display: "inline-block" }}>
              <SmallPhoto photo={new Photo(pic)} />
            </li>
          )
        } else {
          return (
            <li key={pic.id} style={{ display: "inline-block" }}>
              <SmallPhoto photo={new Photo(pic)} />
            </li>
          )
        }
      })}
      {next && (
        <li>
          <OverlaySpinner loading={loading} />
        </li>
      )}
    </ul>
  )
}
