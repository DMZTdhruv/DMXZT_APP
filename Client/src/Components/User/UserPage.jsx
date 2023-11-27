import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { client, urlFor } from "../../client"
import { userProfile, userQuery } from "../../Data/query"
import Spinner from "../Spinner"
import { BsArrowDown, BsArrowUp } from "react-icons/bs"
import { AiFillDelete, AiOutlineCloudUpload } from "react-icons/ai"
import { FcRemoveImage } from "react-icons/fc"
import { jwtDecode } from "jwt-decode"
import { v4 as uuidv4 } from "uuid"

const UserPage = () => {
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { userId } = useParams()
  const [loadingBanner, setLoadingBanner] = useState(false)
  const [loadingProfilePicture, setLoadingProfilePicture] = useState(false)

  //user check state
  const [isUser, setIsUser] = useState(false)
  const [position, setPosition] = useState(50)
  const [isWarning, setIsWarning] = useState(false)

  //image-state
  const [imageAsset, setImageAsset] = useState(false)
  const [imageAssetProfilePicture, setImageAssetPicture] = useState(false)
  const [wrongImageTypeBanner, setWrongTypeImageBanner] = useState(false)
  const [wrongImageTypePfp, setWrongTypeImagePfp] = useState(false)
  const [userIcon, setUserIcon] = useState(false)

  //User-details
  const [username, setUsername] = useState("")
  const [about, setAbout] = useState("")
  const [characters, setCharacters] = useState(0)

  const checkUser = () => {
    const query = userQuery(userId)
    client.fetch(query).then(data => {
      if (data[0]?._id === userId) {
        setIsUser(true)
      } else {
        setIsUser(false)
      }
    })
  }

  useEffect(() => {
    console.log(localStorage.getItem("dmxzt-user"))
    if(!localStorage.getItem("dmxzt-user")){
      navigate("/login",{replace: true})
    }
    document.title = "DMXZT - user profile"
    checkUser()
  }, [])

  const uploadImageBanner = e => {
    const { name, type } = e.target.files[0]
    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/gif" ||
      type === "image/jpeg" ||
      type === "image/tiff"
    ) {
      setWrongTypeImageBanner(false)
      setLoadingBanner(true)

      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then(data => {
          setImageAsset(data)
          setLoadingBanner(false)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      setWrongTypeImageBanner(true)
    }
  }

  const uploadImageProfilePicture = e => {
    const { name, type } = e.target.files[0]
    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/gif" ||
      type === "image/jpeg" ||
      type === "image/tiff"
    ) {
      setWrongTypeImagePfp(false)
      setLoadingProfilePicture(true)

      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then(data => {
          setImageAssetPicture(data)
          setLoadingProfilePicture(false)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      setWrongTypeImagePfp(true)
    }
  }

  const moveUp = () => {
    if (position > 99) {
      return
    } else {
      setPosition(prev => prev + 1)
    }
  }

  const moveDown = () => {
    if (position < 1) {
      return
    } else {
      setPosition(prev => prev - 1)
    }
  }

  const createUser = () => {
    const decode = localStorage.getItem("dmxzt-user")
    const decoded = jwtDecode(decode)
    const { picture, email, name, sub } = decoded
    if (!username || !about || !imageAssetProfilePicture || !imageAsset) {
      setIsWarning(true)
      setTimeout(() => {
        setIsWarning(false)
      }, 2000)
      return
    } else {
      setIsSubmitting(true)
      const doc = {
        _id: uuidv4(),
        _type: "userSection",
        banner: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        googleId: sub,
        bannerPosition: position,
        googleImage: picture,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAssetProfilePicture?._id,
          },
        },
        username: username,
        googleUsername: name,
        about: about,
        gmail: email,
      }

      client
        .create(doc)
        .then(data => {
          navigate("/", { replace: true })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  if (!isUser) {
    return <Spinner message={"Please wait"} isSetTimeoutToggle={true} />
  }

  return (
    <div className="relative dvh-class">
      <div className=" bg-borderClr font-poppins h-full pb-5 absolute overflow-y-scroll w-[100%] ">
        <div className=" bg-borderClr  w-[100%] flex items-center flex-col">
          <div className="user-profile-image-details w-[100%] relative max-h-[400px] h-[400px]">
            <div className="banner-img">
              <div className="bg-borderClr relative overflow-hidden flex-col items-center w-full max-h-[400px] h-[400px] flex justify-center flex-center ">
                {loadingBanner ? (
                  <Spinner
                    height={"100%"}
                    width={"100%"}
                    message={"uploading...."}
                  />
                ) : (
                  <>
                    {wrongImageTypeBanner && (
                      <p className="text-center p-2 h-[100px] flex items-center">
                        The image type you have provided is wrong..
                      </p>
                    )}
                    {!imageAsset ? (
                      <label className="w-full h-full p-5">
                        <div className="border-dotted border-2 w-full h-full flex flex-col justify-center items-center rounded-lg">
                          <div className="flex flex-col items-center justify-center">
                            <AiOutlineCloudUpload size={24} />
                            <p>Upload a banner image</p>
                          </div>
                          <p className=" mt-15 opacity-70 text-center p-2">
                            Recommended to upload high-quality JPEG / SVG / GIF
                            / TIFF of less than 20MB
                          </p>
                        </div>
                        <input
                          type="file"
                          name="uploadImage"
                          onChange={uploadImageBanner}
                          className="w-0 h-0"
                        />
                      </label>
                    ) : (
                      <div className="image h-full flex flex-col items-center justify-center">
                        <img
                          src={imageAsset?.url}
                          style={{ objectPosition: `50% ${position}%` }}
                          className={`h-full w-[100vw] transition-all z-[1] rounded-lg object-cover`}
                        />
                        <button
                          className="absolute z-[9] bottom-3 right-12 rounded-full bg-white text-black p-2 opacity-70 hover:opacity-100 transition-all"
                          onClick={() => setImageAsset(null)}
                        >
                          <AiFillDelete />
                        </button>
                        <button
                          className="absolute z-[9] bottom-12 right-3 rounded-full bg-white text-black p-2 opacity-70 hover:opacity-100 transition-all"
                          onClick={moveUp}
                        >
                          <BsArrowUp strokeWidth="1" />
                        </button>
                        <button
                          className="absolute z-[9] bottom-3 right-3 rounded-full bg-white text-black p-2 opacity-70 hover:opacity-100 transition-all"
                          onClick={moveDown}
                        >
                          <BsArrowDown strokeWidth="1" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="user-icon h-[150px] top-[320px] left-[50%] z-[4] border-8 border-borderClr w-[150px] translate-x-[-50%] bg-borderClr rounded-full overflow-hidden absolute">
              {loadingProfilePicture ? (
                <Spinner height={"100%"} width={"100%"} />
              ) : (
                <>
                  {wrongImageTypePfp && (
                    <p className="text-center p-2 h-full w-full absolute z-[-1] flex items-center justify-center">
                      <FcRemoveImage size={50} />
                    </p>
                  )}
                  {!imageAssetProfilePicture ? (
                    <label className="w-full h-full flex items-center justify-center">
                      <div className="border-dotted border-2 border-neutral-400 w-[90%] h-[90%] flex flex-col justify-center items-center rounded-full">
                        <AiOutlineCloudUpload />
                        <input
                          type="file"
                          name="uploadImage"
                          onChange={uploadImageProfilePicture}
                          className="w-0 h-0"
                        />
                      </div>
                    </label>
                  ) : (
                    <div className="image h-full flex flex-col items-center justify-center">
                      <img
                        src={urlFor(imageAssetProfilePicture?.url)
                          .width(800)
                          .url()}
                        className={`h-full w-full transition-all z-[1] rounded-lg object-cover`}
                      />
                      <button
                        className="absolute z-[9] bottom-4 right-4 rounded-full md:bg-neutral-400 bg-neutral-50 text-black p-2 hover:bg-neutral-50 transition-all"
                        onClick={() => setImageAssetPicture(null)}
                      >
                        <AiFillDelete />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="user-details-value flex mt-20 flex-col items-center justify-center w-full gap-3">
            <div className="name">
              <p className="text-center font-semibold">username</p>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="rounded-full border-2 border-border2Clr px-3 py-2 bg-transparent text-white outline-none"
                type="text"
                placeholder="Enter your name"
              />
            </div>
            <div className="about">
              <p className="text-center font-semibold">Bio</p>
              <textarea
                placeholder="Something that define you beautiful person"
                className="rounded-[18px] w-[80vw] border-2 border-border2Clr px-3 py-2 bg-transparent text-white outline-none"
                name=""
                id=""
                rows="3"
                value={about}
                maxLength={200}
                onChange={e => {
                  setAbout(e.target.value)
                  setCharacters(e.target.value.length)
                }}
              />
              <p className="limit-meter text-right text-[13px]">
                {characters}/200
              </p>
            </div>
          </div>
          {isWarning && (
            <p className="text-[20px] mb-2 text-red-500">
              Enter all the details...
            </p>
          )}
          <button
            className="relative w-[150px] inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-dzBg transition-all duration-150 ease-in-out rounded-full border-dzBg hover:pl-10 hover:pr-6 bg-gray-50 group hover:bg-dzBg"
            onClick={createUser}
          >
            <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-dzBg group-hover:h-full"></span>
            <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
              <svg
                className="w-5 h-5 text-dzbg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
              {isSubmitting ? "submitting.." : "submit"}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserPage
