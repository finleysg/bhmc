import React from "react"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { toast } from "react-toastify"

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { FullPageSpinner } from "./components/spinners/full-screen-spinner"
import { AuthProvider } from "./context/auth-context"
import { DefaultAuthenticationProvider } from "./context/authentication"
import { LayoutProvider } from "./context/layout-context"
import { ErrorScreen } from "./screens/error"

const AdminLayout = React.lazy(() => import("./admin/layout/admin-layout"))
const AuthLayout = React.lazy(() => import("./layout/auth-layout"))
const MainLayout = React.lazy(() => import("./layout/main-layout"))

const routeConfig = [
  {
    path: "*",
    element: <MainLayout />,
    errorElement: <ErrorScreen />,
  },
  {
    path: "admin/*",
    element: <AdminLayout />,
    errorElement: <ErrorScreen />,
  },
  {
    path: "session/*",
    element: <AuthLayout />,
    errorElement: <ErrorScreen />,
  },
]

const routes = createBrowserRouter(routeConfig)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry(failureCount, error) {
        if (error.message === '{"detail":"Authentication credentials were not provided."}')
          return false
        else if (error.name === "NotFound") return false
        else if (failureCount < 2) return true
        else return false
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error.name === "ZodError") {
        console.error(`API parsing error: ${error.message}`, { autoClose: false })
      } else if (error.name === "ServerError") {
        toast.warn(`Server error (hopefully temporary): ${error.message}`)
      } else {
        console.error(error.message)
      }
    },
  }),
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <AuthProvider authenticationProvider={new DefaultAuthenticationProvider()}>
          <RouterProvider router={routes} fallbackElement={<FullPageSpinner />} />
        </AuthProvider>
      </LayoutProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
