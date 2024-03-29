import React from "react"

import { CardContent } from "../components/card/content"
import { ClubDocument } from "../components/document/club-document"
import { HistoricalDocuments } from "../components/document/historical-documents"
import { PointsTable } from "../components/points/points-table"
import { TopPoints } from "../components/points/top-points"
import { IndexTab } from "../components/tab/index-tab"
import { Tabs } from "../components/tab/tabs"
import { DocumentType } from "../models/codes"
import { currentSeason } from "../utils/app-config"

export function SeasonLongPointsScreen() {
  const [selectedCategory, updateSelectedCategory] = React.useState<"gross" | "net">("gross")

  return (
    <div className="content__inner">
      <div className="row">
        <div className="col-xl-3 col-12">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-header mb-2">Current Standings</h4>
              <ClubDocument code="SLPG" documentType="P" />
              <ClubDocument code="SLPN" documentType="P" />
            </div>
          </div>
          <Tabs>
            <IndexTab
              key="gross"
              index={0}
              selectedIndex={selectedCategory === "gross" ? 0 : 1}
              onSelect={() => updateSelectedCategory("gross")}
            >
              Top 50 Gross
            </IndexTab>
            <IndexTab
              key="net"
              index={1}
              selectedIndex={selectedCategory === "gross" ? 0 : 1}
              onSelect={() => updateSelectedCategory("net")}
            >
              Top 50 Net
            </IndexTab>
          </Tabs>
          <TopPoints category={selectedCategory} topN={50} />
        </div>
        <div className="col-xl-6 col-12">
          <CardContent contentKey="season-long-points" />
          <div className="card">
            <div className="card-body">
              <h5 className="card-header mb-2">Points Breakdown by Event</h5>
              <PointsTable />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-12">
          <HistoricalDocuments
            documentTypeCode={DocumentType.Points}
            title="Past Seasons"
            excludedSeason={currentSeason}
          />
        </div>
      </div>
    </div>
  )
}
