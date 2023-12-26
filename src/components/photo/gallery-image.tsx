import { PhotoProps } from "../../models/photo"
import { TagList } from "./tag-list"

export function GalleryImage({ photo }: PhotoProps) {
  return (
    <div>
      <p>{photo.caption}</p>
      <picture>
        <source srcSet={photo.mobileImageUrl()} media="(max-width: 600px)" />
        <source srcSet={photo.webImageUrl()} media="(max-width: 1200px)" />
        <img src={photo.imageUrl()} alt={photo.caption} style={{ width: "100%" }} />
      </picture>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <TagList tags={photo.tags.map((t) => t.tag)} />
        <span>{photo.year}</span>
      </div>
    </div>
  )
}
