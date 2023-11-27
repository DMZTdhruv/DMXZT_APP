import { useState, useEffect } from "react"
import { HiOutlineDownload } from "react-icons/hi"
import { v4 as uuidv4 } from "uuid"
import { BsSend } from "react-icons/bs"
import { Link, useParams, useNavigate } from "react-router-dom"
import { client, urlFor } from "../../client"
import Spinner from "../Spinner"
import {
  pinDetailMorePinQuery,
  pinDetailQuery,
  searchQuery,
} from "../../Data/query"
import { AiFillHeart } from "react-icons/ai"
import { FaBookmark } from "react-icons/fa"
import Comment from "../User_Interaction/Comment"
import { commentQuery } from "../../Data/query"
import CategoryLayout from "./PinSecondLayout"
import PinSecondLayout from "./PinSecondLayout"
import { CgDanger } from "react-icons/cg"
import ImageComponent from "./ImageComponent"

const PinDetails = ({ user }) => {
  const [isLoadingNewPins, setIsLoadingNewPins] = useState(false)
  const [PinDetails, setPinDetails] = useState(null)
  const { pinId } = useParams()
  const [categoryPins, setCategoryPins] = useState([])

  // like handling state
  const [counter, setCounter] = useState(0)

  //animation states
  const [likeAnimation, setLikeAnimation] = useState(false)
  const [isAlreadyLiked, setIsAlreadyLiked] = useState(false)
  const [isSave, setIsSave] = useState(false)

  //download and save
  const [download, setDownload] = useState(false)
  const [saveButton, setSaveButton] = useState(false)

  //comment state
  const [comment, setComment] = useState(null)
  const [userComment, setUserComment] = useState("")
  const navigate = useNavigate()

  //loading states
  const [isCommentSending, setIsCommentSending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [isReported, setIsReported] = useState(false)

  useEffect(()=>{
    document.title = "DMXZT - post detail"
  })


  useEffect(() => {
    setIsLoadingNewPins(true)
    fetchPinDetails()
  }, [pinId])

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId)
    client.fetch(query).then(data => {
      setPinDetails(data[0])
      //handling comment
      setComment(data[0].comment?.reverse())

      //handling likes      
      setCounter(data[0].like === null ? 0 : data[0].like?.length)
      if (data[0].like === null) {
        setIsAlreadyLiked(false)
        setLikeAnimation(false)
      } else {
        setIsAlreadyLiked(
          !!data[0]?.like?.filter(e => e.userId === user.currUserGoogleId)?.length
        )
      }

      //handling saves
      if (data[0].save === null) {
        setIsSave(false)
        setSaveButton(false)
      } else {
        setIsSave(!!data[0]?.save.filter(e => e.userId === user.currUserGoogleId)?.length)
      }
      setIsLoadingNewPins(false)
      query = pinDetailMorePinQuery(data[0])
      client.fetch(query).then(data => {
        setCategoryPins(data)
      })
    })
  }

  const fetchComments = id => {
    const query = commentQuery(id)
    client.fetch(query).then(data => {
      setComment(data[0].comment)
      setIsDeleting(false)
    })
  }

  const deleteToggle = () => {
    setIsDeleting(prev => !prev)
  }

  const postLike = id => {
    client
      .patch(id)
      .setIfMissing({ like: [] })
      .insert("after", "like[-1]", [
        {
          _key: uuidv4(),
          userId: user.currUserGoogleId,
          postedBy: {
            _type: "postedBy",
            _ref: user.currUserProfileId,
          },
        },
      ])
      .commit()
  }

  const postSave = id => {
    client
      .patch(id)
      .setIfMissing({ save: [] })
      .insert("after", "save[-1]", [
        {
          _key: uuidv4(),
          userId: user.currUserGoogleId,
          postedBy: {
            _type: "postedBy",
            _ref: user.currUserProfileId,
          },
        },
      ])
      .commit()
  }

  const unLike = pinId => {
    client
      .patch(pinId)
      .unset([`like[userId == "${user.currUserGoogleId}"]`])
      .commit()
      .then()
      .catch(error => {
        console.error("Error removing like:", error)
        setCounter(prev => prev + 1)
        setLikeAnimation(true)
        setIsAlreadyLiked(true)
      })
  }

  const unSave = pinId => {
    client
      .patch(pinId)
      .unset([`save[userId == "${user.currUserGoogleId}"]`])
      .commit()
      .then()
      .catch(error => {
        console.error("Error removing like:", error)
        setSaveButton(true)
        setIsSave(true)
      })
  }

  // post comment
  const postComment = id => {
    const currentDate = new Date()

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()
    const hours = currentDate.getHours()
    const minutes = currentDate.getMinutes()
    const seconds = currentDate.getSeconds()

    const formattedDateTime = `${year}-${month}-${day < 10 ? `0${day}` : day} ${
      hours < 10 ? `0${hours}` : hours
    }:${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`

    setIsCommentSending(true)
    client
      .patch(id)
      .setIfMissing({ comment: [] })
      .insert("after", "comment[-1]", [
        {
          date: formattedDateTime,
          id: user.currUserGoogleId,
          _key: uuidv4(),
          username: user.username,
          image: user.image,
          userComment: userComment,
          postedBy: {
            _type: "postedBy",
            _ref: user.currUserProfileId,
          },
        },
      ])
      .commit()
      .then(data => {
        setComment(data.comment)
        setIsCommentSending(false)
        setUserComment("")
      })
  }

  const reportPost = pinId => {
    setIsReporting(true)
    const doc = {
      _id: uuidv4(),
      _type: "report",
      username: user?.username,
      userId: user?.currUserGoogleId,
      pinImage: PinDetails?.postedBy?.image?.asset?.url,
      pinId: pinId,
    }
    client
      .createIfNotExists(doc)
      .then(data => {
        setIsReported(true)
        setTimeout(() => {
          setIsReported(false)
        }, 2000)
        setIsReporting(false)
      })
      .catch(err => {
        console.log("Error")
      })
  }

  if (!PinDetails || isLoadingNewPins) {
    return (
      <div className="font-poppins pinDetails flex flex-col bg-dzBg w-[100%] justify-center items-center top-0 dvh-class left-0 z-[999] fixed ">
        <Spinner message={"loading pin's"} />
      </div>
    )
  }

  // flex flex-col lg:flex-row  items-center sm:p-5 p-2 overflow-y-scroll  sm:w-[80vw] w-[100vw] bg-borderClr sm:rounded-[30px] shadow-md
  return (
    <div className="font-poppins dvh-class pinDetails flex flex-col bg-dzBg w-[100%] justify-center items-center top-0 dvh-class left-0 z-[999] fixed ">
      <div
        className="fixed top-5 left-5 z-[9999] shadow-md rounded-full w-[45px] h-[45px] cursor-pointer bg-neutral-300 hover:bg-white flex items-center justify-center"
        onClick={() => navigate("/")}
      >
        <svg
          className="Hn_ gUZ R19 U9O kVc"
          height="20"
          width="20"
          viewBox="0 0 24 24"
          aria-hidden="true"
          aria-label=""
          role="img"
        >
          <path d="M8.415 4.586a2 2 0 1 1 2.828 2.828L8.657 10H21a2 2 0 0 1 0 4H8.657l2.586 2.586a2 2 0 1 1-2.828 2.828L1 12l7.415-7.414z"></path>
        </svg>
      </div>
      <div
        className={`flex flex-col h-full relative items-center overflow-y-scroll w-full shadow-md`}
      >
        <img
          src={urlFor(PinDetails.image.asset.url).width(1).url()}
          className=" opacity-20 lg:inline-block hidden  object-cover absolute z-[-1] h-[100%] w-[100%]"
          alt=""
        />
        <div className="pin-components lg:h-[100vh] h-auto pt-2 relative items-center lg:w-[80vw]  pb-10  w-[100%] sm:p-5 p-3 flex flex-col lg:flex-row">
          <img
            src={urlFor(PinDetails.image.asset.url).width(1).url()}
            className=" opacity-20 m-[-1.25rem]  lg:hidden block object-cover absolute z-[-1] h-[110%] w-[150%]"
            alt=""
          />
          <div className="sm:hidden flex justify-end w-full my-5 sm:p-0">
            <Link
              to={`/user-profile/${PinDetails?.userId}`}
              className="user-details flex items-center px-2 py-1 shadow-sm rounded-full bg-border2Clr justify-center"
            >
              <img
                className="rounded-full w-[24px] h-[24px] object-cover"
                src={PinDetails?.postedBy?.image?.asset?.url}
                alt=""
              />
              <p className="font-semibold pl-1">
                {PinDetails?.postedBy?.username}
              </p>
            </Link>
          </div>
          <div className="image lg:h-[100vh] flex items-center">
            <ImageComponent
              className={
                "shadow-lg rounded-[20px] sm:max-w-[500px]  min-w-[100%] lg:max-h-[90vh] h-[100%]"
              }
              defaultLoad={true}
              HighQualityImage={urlFor(PinDetails?.image).url()}
              lowImageQuality={urlFor(PinDetails?.image).width(7).url()}
            />
          </div>
          <div className="image-details-wrapper sm:w-[80vw] w-full">
            <div className="image-details w-full gap-3 md:pl-5 h-full items-start flex-col flex">
              <div className="pin-detail font-poppins w-full">
                <ul className="pin-details-links  flex gap-5 mt-5 w-[100%]">
                  <li
                    className="flex  cursor-pointer"
                    onClick={() => {
                      if (isAlreadyLiked) {
                        unLike(pinId)
                        setCounter(prev => prev - 1)
                        setLikeAnimation(false)
                        setIsAlreadyLiked(false)
                      } else {
                        postLike(pinId)
                        setLikeAnimation(prev => !prev)
                        setCounter(prev => prev + 1)
                        setIsAlreadyLiked(prev => !prev)
                      }
                    }}
                  >
                    <AiFillHeart
                      size={20}
                      fill={"transparent"}
                      className={`${
                        likeAnimation | isAlreadyLiked
                          ? "animation-buttons fill-pink-600 stroke-pink-600"
                          : "fill-transparent opacity-50"
                      } transition-all `}
                      stroke="white"
                      strokeWidth={100}
                    />
                    <p className="translate-x-[5px] mt-[-2px]">{counter}</p>
                  </li>
                  <a
                    href={`${PinDetails.image.asset.url}?dl=`}
                    download
                    className="flex gap-2 cursor-pointer "
                    onClick={() => setDownload(prev => !prev)}
                  >
                    <HiOutlineDownload
                      size={20}
                      fill={"transparent"}
                      className={`${
                        download
                          ? "animation-buttons stroke-blue-600"
                          : "fill-transparent opacity-50"
                      } transition-all opacity-40 hover:opacity-100`}
                    />
                  </a>
                  <li
                    className="flex gap-2  translate-x-[-2px] cursor-pointer"
                    onClick={() => {
                      setSaveButton(prev => !prev)
                      if (isSave) {
                        unSave(pinId)
                        setSaveButton(false)
                        setIsSave(false)
                      } else {
                        setIsSave(prev => !prev)
                        postSave(pinId)
                      }
                    }}
                  >
                    <FaBookmark
                      size={18}
                      fill={"transparent"}
                      stroke="white"
                      strokeWidth={40}
                      className={`${
                        saveButton | isSave
                          ? "animation-buttons fill-cyan-600 stroke-cyan-600"
                          : "fill-transparent opacity-50"
                      } transition-all  `}
                    />
                  </li>
                  <div
                    className="flex gap-2 border-b-0 items-center cursor-pointer"
                    onClick={() => reportPost(pinId)}
                  >
                    <CgDanger
                      size={20}
                      className="opacity-50 hover:opacity-100"
                    />
                    <p
                      className={`${
                        isReporting || isReported ? "block" : "hidden"
                      }`}
                    >
                      {isReporting
                        ? "reporting..."
                        : isReported
                        ? "reported "
                        : "report"}
                    </p>
                  </div>
                </ul>
                <h2 className=" text-[32px] font-semibold">
                  {PinDetails?.title}
                </h2>
                <p>{PinDetails?.about}</p>
                {comment != null && (
                  <div className="comment-section mt-5 w-full  bg-slate-800 overflow-hidden rounded-[20px]">
                    <div className="max-h-[300px] overflow-y-scroll">
                      {comment.map(comment => {
                        return (
                          <Comment
                            key={comment.id}
                            userCommentDetails={{ ...comment }}
                            user={user}
                            borderClr={"borderClr"}
                            pinId={pinId}
                            fetchComments={fetchComments}
                            deleteToggle={deleteToggle}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}
                <div className="add-comment w-full flex  mt-5 gap-2 items-center justify-start">
                  <div className="user-icon flex-shrink-0 h-[54px] w-[54px] rounded-full">
                    <img
                      className="rounded-full h-full w-full object-cover"
                      src={user.image}
                      alt=""
                    />
                  </div>
                  <div className="user-comment w-full relative ">
                    <input
                      type="text"
                      value={userComment}
                      onChange={e => setUserComment(e.target.value)}
                      placeholder="Add a comment"
                      className="w-full pr-[2.5rem] whitespace-wrap px-3 border-2 border-slate-500 py-2 outline-none rounded-full bg-transparent "
                    />
                    <button
                      onClick={() => postComment(pinId)}
                      className="absolute right-1.5 top-[50%] transition-all hover:opacity-100 translate-y-[-50%] flex items-center justify-center bg-neutral-400 hover:bg-white w-[30px] h-[30px] rounded-full"
                    >
                      <BsSend fill="black" className="mt-0.5" />
                    </button>
                  </div>
                </div>
                {isCommentSending && (
                  <div className="flex items-center justify-center">
                    {" "}
                    <Spinner height={"h-full"} width={"h-full"} /> Posting
                    Comment...
                  </div>
                )}
                {isDeleting && (
                  <div className="flex items-center justify-center">
                    {" "}
                    <Spinner height={"h-full"} width={"h-full"} /> Deleting
                    Comment...
                  </div>
                )}
              </div>
              <Link
                to={`/user-profile/${PinDetails?.userId}`}
                className="user-details hidden sm:flex items-center px-2 py-1 shadow-sm rounded-full bg-border2Clr justify-center"
              >
                <img
                  className="rounded-full h-[24px] w-[24px] object-cover"
                  src={PinDetails?.postedBy?.image?.asset?.url}
                  alt=""
                />
                <p className="font-semibold pl-1">
                  {PinDetails?.postedBy?.username}
                </p>
              </Link>
            </div>
          </div>
        </div>

        {categoryPins.length != 0 && (
          <div>
            <div className="categoryPins md:pb-8 pb-28 rounded-t-[40px] md:px-8 px-2 bg-dzBg pt-5 md:pt-3 w-full">
              <p className="text-center w-full border-b-2 border-border2Clr font-semibold text-[18px] pb-3">
                More pins
              </p>
              <div className="columns-2 pt-5 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4">
                {categoryPins.map(pin => {
                  return (
                    <PinSecondLayout
                      key={pin._id}
                      pin={{ ...pin }}
                      user={user}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PinDetails
