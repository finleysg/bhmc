import React, { PropsWithChildren } from "react"

import { isExtraLarge } from "../styles/media-queries"
import { useEventListener } from "../utils/use-event-listener"

interface ILayoutContext {
  sidebarOpen: boolean
  closeSidebar?: () => void
  openSidebar?: () => void
  toggleSidebar?: () => void
}

export const LayoutContext = React.createContext<ILayoutContext>({ sidebarOpen: false })
LayoutContext.displayName = "LayoutContext"

export function LayoutProvider(props: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = React.useState(!!isExtraLarge())

  const resizeHandler = React.useCallback((event: Event) => {
    const eventTarget = event.target as Window
    if (eventTarget?.innerWidth >= 1200) {
      setSidebarOpen(true)
    }
  }, [])

  useEventListener("resize", resizeHandler)

  const closeSidebar = () => {
    if (!isExtraLarge()) {
      setSidebarOpen(false)
    }
  }

  const openSidebar = () => {
    setSidebarOpen(true)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const value = {
    sidebarOpen,
    closeSidebar,
    openSidebar,
    toggleSidebar,
  }

  return <LayoutContext.Provider value={value} {...props} />
}
