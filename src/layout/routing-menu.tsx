import React from "react"

import { BiDotsVerticalRounded } from "react-icons/bi"
import { Link } from "react-router-dom"

interface ILink {
  to: string
  name: string
}

export function RoutingMenu(props: { links: ILink[] }) {
  const { links } = props
  const [showMenu, setShowMenu] = React.useState(false)

  return (
    <div
      className="actions actions--inverse login__actions"
      role="button"
      tabIndex={0}
      onClick={() => setShowMenu(!showMenu)}
      onKeyDown={() => setShowMenu(!showMenu)}
    >
      <div className="dropdown">
        <i className="actions__item">
          <BiDotsVerticalRounded />
        </i>

        <div className={`dropdown-menu dropdown-menu-right ${showMenu ? "show" : ""}`}>
          {links.map((link, index) => {
            return (
              <Link
                key={link.name}
                to={link.to}
                className="dropdown-item"
                role="menuitem"
                tabIndex={index + 1}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
