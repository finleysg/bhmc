import { MemberhipReport } from "../../components/reports/membership-report"
import { CloneEventsScreen } from "../screens/clone-events"
import { ClubDocumentsScreen } from "../screens/club-documents"
import { EventDocumentsScreen } from "../screens/event-documents"
import { EventReportScreen } from "../screens/event-report"
import { ImportPointsScreen } from "../screens/import-points"
import { ImportScoresScreen } from "../screens/import-scores"
import { ManagePlayersScreen } from "../screens/manage-players"
import { PaymentReportScreen } from "../screens/payment-report"
import { UpdatePortalScreen } from "../screens/update-portal"
import { UploadPhotoScreen } from "../screens/upload-photo"
import { ViewSlotsScreen } from "../screens/view-slots"
import { Admin } from "./admin"
import { AdminMenu } from "./admin-menu"
import { EventAdmin } from "./event-admin"
import { EventAdminMenu } from "./event-admin-menu"

export interface EventAdminHandle {
  title: string
}

export const adminRoutes = () => [
  {
    path: "",
    element: <Admin />,
    children: [
      { element: <AdminMenu />, index: true },
      { path: "clone-events", element: <CloneEventsScreen /> },
      { path: "membership-report", element: <MemberhipReport /> },
      { path: "upload-photo", element: <UploadPhotoScreen /> },
      { path: "club-documents", element: <ClubDocumentsScreen /> },
      {
        path: "event/:eventId",
        element: <EventAdmin />,
        children: [
          { element: <EventAdminMenu />, index: true },
          { path: "event-report", element: <EventReportScreen /> },
          { path: "payment-report", element: <PaymentReportScreen /> },
          { path: "skins-report", element: <div>TODO: skins report</div> },
          { path: "manage-players", element: <ManagePlayersScreen /> },
          { path: "update-portal", element: <UpdatePortalScreen /> },
          { path: "manage-documents", element: <EventDocumentsScreen /> },
          { path: "import-points", element: <ImportPointsScreen /> },
          { path: "import-scores", element: <ImportScoresScreen /> },
          { path: "import-winners", element: <div>TODO: import winners screen</div> },
          { path: "view-slots", element: <ViewSlotsScreen /> },
        ],
      },
    ],
  },
]
