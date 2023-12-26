import { BoardMemberProps } from "../../models/board-member"

export function BoardMemberBadge({ boardMember }: BoardMemberProps) {
  if (boardMember) {
    return (
      <h6 className="text-light-blue" style={{ marginBottom: "1rem" }}>
        ⭐ Board Member
      </h6>
    )
  }
  return null
}
