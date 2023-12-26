import { useEventAdmin } from "./event-admin"
import {
  EventReportCard,
  EventSettingsCard,
  ImportPointsCard,
  ImportScoresCard,
  ImportWinnersCard,
  ManageDocumentsCard,
  ManagePlayersCard,
  PaymentReportCard,
  SkinsReportCard,
  UpdatePortalCard,
  ValidateSlotsCard,
} from "./event-admin-cards"

export function EventAdminMenu() {
  const { clubEvent } = useEventAdmin()

  return (
    <div>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        <div className="col">
          <EventReportCard />
        </div>
        <div className="col">
          <PaymentReportCard />
        </div>
        <div className="col">
          <SkinsReportCard />
        </div>
        <div className="col">
          <ManagePlayersCard />
        </div>
        <div className="col">
          <UpdatePortalCard />
        </div>
        <div className="col">
          <ManageDocumentsCard />
        </div>
        <div className="col">
          <ImportPointsCard />
        </div>
        <div className="col">
          <ImportScoresCard />
        </div>
        <div className="col">
          <ImportWinnersCard />
        </div>
        {clubEvent.canChoose && clubEvent.registrationWindow === "future" && (
          <div className="col">
            <ValidateSlotsCard />
          </div>
        )}
        <div className="col">
          <EventSettingsCard eventId={clubEvent.id} />
        </div>
      </div>
    </div>
  )
}
