import { MyEvents } from "../components/account/my-events"
import { MyFriends } from "../components/account/my-friends"

export function AccountSettingsScreen() {
  return (
    <div className="content__inner">
      <div className="row">
        <div className="col-lg-4 col-md-6 col-12">
          <MyEvents />
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          <MyFriends />
        </div>
        <div className="col-lg-4 col-md-6 col-12">{/* <MyCards /> */}</div>
      </div>
    </div>
  )
}
