import { useState, useRef, useEffect } from "react"
import { client } from "../client"
import Pin from "./Pin"
import { jwtDecode } from "jwt-decode"
import { userProfile, userQuery } from "../Data/query"
import { Route, Routes, useNavigate } from "react-router-dom"
import Spinner from "../Components/Spinner"
import { SideBar, UserSection } from "../Components/User_Interaction"

export const Home = () => {
  const [user, setUser] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const [user2, setUser2] = useState("")
  useEffect(() => {
    setIsLoading(true)
    const decode = localStorage.getItem("dmxzt-user")
    if(decode === null){
      navigate("/login",{replace: true})
      window.location.reload()
    } else {
      setUser(jwtDecode(decode))
    }
    const decoded = jwtDecode(decode)
    const { sub } = decoded
    const user_query = userQuery(sub)
    const user_profile_query = userProfile(sub)
    client
      .fetch(user_query)
      .then(data => {
        if (data.length == 0) {
          navigate("/login", { replace: true })
        } else {
          client
            .fetch(user_profile_query)
            .then(data => {
              if (data.length == 0) {
                navigate(`/user-page/${sub}`, { replace: true })
              } else {
                const { username, banner, googleId, image, _id } = data[0]
                const userDetails = {
                  currUserProfileId: _id,
                  currUserGoogleId: googleId,
                  banner: banner,
                  image: image?.asset?.url,
                  username: username,
                }
                setUser2(userDetails)
                setIsLoading(false)
              }
            })
            .catch(err => {
              console.log(`err: ${err.message}`)
            })
        }
      })
      .catch(err => {
        console.log(`err: ${err.message}`)
      })
  }, [])
  const [toggleSideBar, setToggleBar] = useState(false)

  const funcToggleSidebar = () => {
    setToggleBar(prev => !prev)
  }

  const [searchValue, setSearchValue] = useState("")
  const searchValueFunc = value => {
    setSearchValue(value)
  }

  if (!user) {
    return (
      <>
        <Spinner login={true} />
      </>
    )
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="h-screen flex w-[100vw]">
      <SideBar
        user={user2}
        funcToggleSidebar={funcToggleSidebar}
        openSideBar={toggleSideBar}
        searchValue={searchValue}
        searchValueFunc={searchValueFunc}
      />
      <div className="border-x-1 border-borderClr relative">
        <Routes>
          <Route
            path="/*"
            element={
              <Pin
                toggleSideBar={funcToggleSidebar}
                user={user2}
                searchValue={searchValue}
                searchValueFunc={searchValueFunc}
              />
            }
          />
        </Routes>
      </div>
      <UserSection user={user2} searchValueFunc={searchValueFunc} />
      {/* <div className="h-[60px] upload fixed bottom-0 border-borderClr  left-0 backdrop-blur-sm w-[100vw] flex items-center justify-evenly ">
        <HiMenu size={24} />
        <AiOutlineUpload size={24} />
        <img src={logo} alt="" height={24} />
      </div> */}
    </div>
  )
}
