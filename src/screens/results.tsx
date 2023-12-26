import { useParams } from "react-router-dom"

import { ResultDetail } from "../components/results/result-detail"
import { Tab } from "../components/tab/tab"
import { Tabs } from "../components/tab/tabs"
import { SeasonMenu } from "../layout/season-menu"
import { currentSeason } from "../utils/app-config"

export function ResultsScreen() {
  const { eventType, season } = useParams()

  const year = season ? +season : currentSeason

  return (
    <div className="content__inner">
      <SeasonMenu baseUrl={`/results/${eventType}`} season={year} startAt={2013} />
      <div>
        <Tabs>
          <Tab to={`/results/weeknight-events/${season}`}>Weeknight Events</Tab>
          <Tab to={`/results/weekend-majors/${season}`}>Weekend Majors</Tab>
          <Tab to={`/results/other/${season}`}>Other Events</Tab>
        </Tabs>
        <ResultDetail eventTypeStub={eventType ?? "weeknight-events"} season={year} />
      </div>
    </div>
  )
}
