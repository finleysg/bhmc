import { useQuery } from "@tanstack/react-query"

import poweredBy from "../assets/img/Poweredby_100px-White_VertLogo.png"
import { httpClient } from "../utils/api-client"
import * as config from "../utils/app-config"

export function MaintenanceScreen() {
  const { data } = useQuery({
    queryKey: ["gif", "gwAYrJaPllFEH55xua"],
    queryFn: () =>
      httpClient(`https://api.giphy.com/v1/gifs/gwAYrJaPllFEH55xua?api_key=${config.giphyApiKey}`),
  })

  return (
    <div className="content__inner">
      <div style={{ margin: "20px auto 0 auto", textAlign: "center" }}>
        <h1 className="text-danger">System Maintenance</h1>
        <div style={{ textAlign: "center" }}>
          {data && (
            <>
              <img
                style={{ maxWidth: "100%", objectFit: "contain" }}
                src={data.url}
                title={data.title}
                alt="System maintenance"
              />
              <img
                style={{ display: "block", margin: "1rem auto 0 auto" }}
                src={poweredBy}
                alt="Powered By Giphy"
                title="Powered By Giphy"
              />
            </>
          )}
        </div>
        <h3 className="text-primary" style={{ marginTop: "30px" }}>
          We&apos;re Doing Some Work
        </h3>
        <p>The website will return shortly.</p>
      </div>
    </div>
  )
}
