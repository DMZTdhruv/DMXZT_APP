import { useEffect, useId, useReducer, useState } from "react"
import { useParams } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import {
  userPinQuery,
  userSavedQuery,
  userProfile,
  userQuery,
} from "../Data/query"
import { client, urlFor } from "../client"
import PinSecondLayout from "../Components/PinSections/PinSecondLayout"
import Spinner from "../Components/Spinner"
import { AiOutlineHome } from "react-icons/ai"
import { Link } from "react-router-dom"

const UserProfile = () => {
  const { userId } = useParams()
  const [isAdmin, setIsAdmin] = useState(false)
  const [userDetails, setUserDetails] = useState(false)
  const [createdPins, setCreatedPins] = useState(null)
  const [savedPins, setSavedPins] = useState([])
  const decode = localStorage.getItem("dmxzt-user")
  const [loadingNewProfile, setLoadingNewProfile] = useState(false)
  const [created, setCreated] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [localUser, setLocalUser] = useState("")

  const [userExist, setIsUserExist] = useState(false)
  useEffect(() => {
    setIsUserExist(true)
    setLoadingNewProfile(true)
    setIsSaving(false)
    const decoded = jwtDecode(decode)
    userDetailsFunc(decoded.sub)
    document.title = `Dmxzt - user details`
  }, [userId])

  function userDetailsFunc(id) {
    const query = userProfile(userId)
    client.fetch(query).then(data => {
      if (data.length === 0) {
        setIsUserExist(false)
      } else {
        setIsUserExist(true)
        setLoadingNewProfile(false)
        const currUserQuery = userProfile(id)
        client.fetch(currUserQuery).then(curr => {
          setLocalUser(curr[0])
          const { username, banner, googleId, image, _id } = data[0]
          const userDetails = {
            currUserProfileId: curr[0]._id,
            currUserGoogleId: id,
            userId: _id,
            _id: googleId,
            banner: banner,
            image: image?.asset?.url,
            username: username,
          }
          if (id === userDetails?._id) {
            setIsAdmin(true)
          }
          createdPinsFunc(userDetails?._id)
          savedPinsFunc(userDetails?._id)
          setUserDetails(userDetails)
        })
      }
    })
  }

  function createdPinsFunc(id) {
    const query = userPinQuery(id)
    client.fetch(query).then(data => {
      setCreatedPins(data)
      setIsDeleting(false)
    })
  }

  function savedPinsFunc(id) {
    const query = userSavedQuery(id)
    client.fetch(query).then(data => {
      setSavedPins(data)
      isSavingFunc(false)
    })
  }

  const isDeletingFunc = () => {
    setIsDeleting(true)
  }

  if (!userExist) {
    return <Spinner message={"user doesn't exist!"} />
  }

  if (loadingNewProfile) {
    return <Spinner message={"Loading..."} />
  }

  function isSavingFunc(value) {
    setIsSaving(value)
  }

  return (
    <div className="font-poppins bg-dzBg dvh-class relative w-[100%]">
      <Link
        to="/"
        className="fixed top-5 left-5 z-[9999] shadow-md rounded-full w-[45px] h-[45px] cursor-pointer bg-neutral-300 hover:bg-white flex items-center justify-center"
      >
        <AiOutlineHome size={24} fill={"black"} />
      </Link>
      <div className="scrollSection w-[100%] h-full absolute overflow-y-scroll">
        <div className="user-section">
          <div className="banner relative h-[300px] w-[100%]">
            {userDetails ? (
              <img
                className="w-full h-full object-cover"
                style={{
                  objectPosition: `center ${userDetails?.bannerPosition}%`,
                }}
                src={userDetails?.banner?.asset?.url}
                alt=""
              />
            ) : (
              <Spinner
                message={"loading banner"}
                height={"100%"}
                width={"100%"}
              />
            )}
            <div className=" user-icon absolute z-10 bottom-[-80px] border-dzBg left-[50%] translate-x-[-50%] rounded-full border-8 h-[150px] w-[150px]  flex items-center justify-center">
              {userDetails ? (
                <img
                  className=" rounded-full h-full w-full object-cover"
                  src={urlFor(userDetails?.image).width(800).url()}
                  alt=""
                />
              ) : (
                <Spinner message={"pfp"} height={"100%"} width={"100%"} />
              )}
            </div>
          </div>
          <div className="user-details flex items-center justify-center mt-[80px]">
            <div className="user-details-section text-center">
              <div className="name text-[30px] font-semibold">
                {userDetails?.username}
              </div>
              <div className="name text-[12px] opacity-70 ">
                {userDetails?.about}
              </div>
            </div>
          </div>
          <div className="posts md:pb-8 pb-28 ">
            <div className="flex gap-3 items-center justify-center mt-5">
              <button
                className={`px-3 py-2 rounded-full ${
                  created ? " bg-border2Clr border-2" : "bg-active"
                } text-[18px] font-semibold`}
                onClick={() => setCreated(true)}
              >
                Created
              </button>
              <button
                className={`px-3 py-2 rounded-full ${
                  !created ? " bg-border2Clr border-2" : "bg-active"
                } text-[18px] font-semibold `}
                onClick={() => setCreated(false)}
              >
                Saved
              </button>
            </div>
            <div>
              {isDeleting || isSaving ? (
                <Spinner
                  message={`${isDeleting ? "deleting pin.." : ""} ${
                    isSaving ? "removing a saved pin..." : ""
                  }`}
                  height={"100%"}
                  width={"100%"}
                />
              ) : created ? (
                createdPins ? (
                  createdPins.length != 0 ? (
                    <div className="categoryPins pb-3 rounded-t-[40px] md:px-8 px-2 bg-dzBg pt-5 w-full">
                      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4">
                        {createdPins?.map(pin => {
                          return (
                            <PinSecondLayout
                              key={pin._id}
                              pin={{ ...pin }}
                              user={userDetails}
                              isAdmin={isAdmin}
                              userDetailsFunc={userDetailsFunc}
                              isDeletingFunc={isDeletingFunc}
                              idSavingFunc={isSavingFunc}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="font-semibold mt-5 text-center">
                      No created pins were found of this user
                    </p>
                  )
                ) : (
                  <Spinner
                    message={"Loading created pins"}
                    height={"100%"}
                    width={"100%"}
                  />
                )
              ) : savedPins ? (
                savedPins.length != 0 ? (
                  <div className="categoryPins pb-3 rounded-t-[40px] md:px-8 px-2 bg-dzBg pt-5 w-full">
                    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4">
                      {savedPins?.map(pin => {
                        return (
                          <PinSecondLayout
                            key={pin._id}
                            pin={{ ...pin }}
                            user={userDetails}
                            isSavingFunc={isSavingFunc}
                            savedPinsFunc={savedPinsFunc}
                          />
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="font-semibold mt-5 text-center">
                    No saved pins were found by this user
                  </p>
                )
              ) : (
                <Spinner
                  message={"Loading saved pins"}
                  height={"100%"}
                  width={"100%"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
