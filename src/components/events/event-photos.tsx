import React from "react"

import { NavLink } from "react-router-dom"

import { ClubEventProps } from "../../models/common-props"
import * as colors from "../../styles/colors"
import { PhotoUploader } from "../photo/photo-uploader"
import { RandomPicList } from "../photo/random-pic-list"

export function EventPhotos({ clubEvent }: ClubEventProps) {
  const [tags, setTags] = React.useState<string[]>([])

  React.useEffect(() => {
    if (clubEvent.defaultTag) {
      const defaultTags = []
      defaultTags.push(clubEvent.defaultTag)
      setTags(defaultTags)
    }
  }, [clubEvent])

  if (clubEvent.defaultTag) {
    return (
      <div className="card">
        <div className={`card-header bg-info`}>
          <span style={{ color: colors.white, fontSize: "1.2rem", marginRight: "1rem" }}>
            Event Photos
          </span>
        </div>
        <div className="card-body">
          <PhotoUploader defaultTags={tags} season={clubEvent.startDate.getFullYear()} />
          <RandomPicList tag={clubEvent.defaultTag} take={1} />
          <NavLink to={`/gallery?tag=${clubEvent.defaultTag}`}>
            Go to the {clubEvent.defaultTag} photo gallery
          </NavLink>
        </div>
      </div>
    )
  }

  return null
}
