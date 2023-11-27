import { Route, Routes } from "react-router-dom"
import Feed from "../Components/PinSections/Feed"
import { Header } from "../Components/User_Interaction/"
import CreatePin from "../Components/PinSections/CreatePin"
import PinDetails from "../Components/PinSections/PinDetails"

const Pin = ({ toggleSideBar, user, searchValue, searchValueFunc }) => {
  return (
    <>
      <Header
        toggleSideBar={toggleSideBar}
        user={user}
        searchValue={searchValue}
        searchFunc={searchValueFunc}
      />
      <div className="f1239diq9dao9e10 min-h-[100vh] pb-5">
        <Routes>
          <Route
            path="/"
            element={<Feed searchValue={searchValue} user={user && user} />}
          />
          <Route
            path="/explore"
            element={<Feed searchValue={searchValue} user={user && user} />}
          />
          <Route
            path="/category/:categoryId"
            element={<Feed user={user && user} searchValue={searchValue} />}
          />
          <Route
            path="/pin-detail/:pinId"
            element={<PinDetails user={user && user} />}
          />
          <Route
            path="/create-pin"
            element={<CreatePin user={user && user} />}
          />
        </Routes>
      </div>
    </>
  )
}

export default Pin
