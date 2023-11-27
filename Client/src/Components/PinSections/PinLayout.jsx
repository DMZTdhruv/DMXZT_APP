import { useEffect, useRef, useState } from "react"
import { BsSend } from "react-icons/bs"
import { HiOutlineDownload } from "react-icons/hi"
import { v4 as uuidv4 } from "uuid"
import { Link, useNavigate } from "react-router-dom"
import { client, urlFor } from "../../client"
import { AiFillHeart } from "react-icons/ai"
import { FaBookmark } from "react-icons/fa"
import { LuMessageCircle } from "react-icons/lu"
import { commentQuery } from "../../Data/query"
import { Comment } from "../User_Interaction"
import Spinner from "../Spinner"
import { BsArrowDown } from "react-icons/bs"
import { CgDanger } from "react-icons/cg"
import ImageComponent from "./ImageComponent"

//save data
const PinLayout = ({
  likes,
  user,
  _id,
  save,
  userId,
  image,
  username,
  category,
  userImg,
  about,
}) => {
  const commentSectionScrollRef = useRef(null)
  const commentScrollRef = useRef(null)
  // Animations state
  const [likeAnimation, setLikeAnimation] = useState(false)
  const [isAlreadyLiked, setIsAlreadyLiked] = useState(false)
  const [isSave, setIsSave] = useState(false)

  //download and save
  const [download, setDownload] = useState(false)
  const [saveButton, setSaveButton] = useState(false)

  // like handling state
  const [counter, setCounter] = useState(0)

  // comment state
  const [openComment, setOpenComment] = useState(false)
  const [comments, setComments] = useState(null)
  const [openCommentSection, setOpenCommentSection] = useState(false)
  const [userComment, setUserComment] = useState("")

  //comment loading State
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCommentSending, setIsCommentSending] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [isReported, setIsReported] = useState(false)

  const navigate = useNavigate()

  const fetchComments = id => {
    const query = commentQuery(id)
    client.fetch(query).then(data => {
      setComments(data[0]?.comment?.reverse())
      setIsDeleting(false)
    })
  }

  const deleteToggle = () => {
    setIsDeleting(prev => !prev)
  }
  //use effect to set number of likes
  useEffect(() => {
    setCounter(likes === null ? 0 : likes?.length)
    if (likes === null) {
      setIsAlreadyLiked(false)
    } else {
      setIsAlreadyLiked(!!likes?.filter(e => e.userId === user.currUserGoogleId)?.length)
    }

    fetchComments(_id)
    if (save === null) {
      setIsSave(false)
    } else {
      setIsSave(!!save?.filter(e => e.userId === user.currUserGoogleId)?.length)
    }
  }, [])

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
        setComments(data?.comment?.reverse())
        setIsCommentSending(false)
        setUserComment("")
      })
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

  const scrollToCommentSection = () => {
    if (commentSectionScrollRef.current) {
      if (openCommentSection == false) {
        commentSectionScrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }
    }
  }

  const scrollToComment = () => {
    if (commentScrollRef.current) {
      if (openComment === false) {
        commentScrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }
    }
  }

  const reportPost = pinId => {
    setIsReporting(true)
    const doc = {
      _id: uuidv4(),
      _type: "report",
      username: user?.username,
      userId: user?.currUserGoogleId,
      pinImage: image,
      pinId: pinId,
    }
    client
      .createIfNotExists(doc)
      .then(data => {
        setIsReported(true)
        setIsReporting(false)
        setTimeout(() => {
          setIsReported(false)
        }, 2000)
      })
      .catch(err => {
        console.log("Error")
      })
  }

  return (
    <>
      <div
        id={_id}
        className="pin-1 border-y-2 border-borderClr m w-[100%] flex  md:gap-5 gap-3  md:px-[35px] px-[13px] py-[20px]"
      >
        <div className="icon-section">
          <div className="icon-wrapper md:h-[49px] md:w-[49px] w-[35px] h-[35px] rounded-full overflow-hidden">
            <Link to={`user-profile/${userId}`}>
              <img
                src={userImg}
                height={49}
                width={49}
                className="object-cover h-full w-full"
                alt=""
              />
            </Link>
          </div>
        </div>
        <div className="post-section flex md:gap-5 gap-2 flex-col w-full">
          <div className="user-title-name ">
            <div className="user text-[20px] pb-0 font-poppins flex items-center">
              <Link to={`/user-profile/${userId}`}>{username}</Link>
              <button className="hover:bg-buttonClrHover transition-colors bg-borderClr rounded-[18px] px-2 py-1 text-[14px] ml-3">
                <Link to={`/category/${category}`}>{category}</Link>
              </button>
            </div>
            <div className="title-section font-poppins pt-2 md:text-[15px] text-[13px] leading-6 opacity-80">
              {about}
            </div>
          </div>
          <div className="image-section  flex gap-6 sm:flex-row flex-col w-full">
            <div className="img-wrapper border-2 border-borderClr max-w-[543px] w-full rounded-[18px] overflow-hidden"
              onClick={()=>{navigate(`/pin-detail/${_id}`)}}
            >
              <ImageComponent className={"w-[100%]"} HighQualityImage={urlFor(image).width(900).url()} lowImageQuality={urlFor(image).width(5).url()} />
            </div>
            <div>
              <ul className="flex sm:flex-col md:text-[15px] text-left text-[12px] flew-row flex-wrap gap-3 items-start">
                <li
                  className="flex gap-2 cursor-pointer"
                  onClick={() => {
                    if (isAlreadyLiked) {
                      unLike(_id)
                      setCounter(prev => prev - 1)
                      setLikeAnimation(false)
                      setIsAlreadyLiked(false)
                    } else {
                      postLike(_id)
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
                  <p>{counter}</p>
                </li>
                <a
                  href={`${image}?dl=`}
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
                  <p className="hidden sm:block">Download</p>
                </a>
                <li
                  className="flex gap-2 ml-[3px] translate-x-[-2px] cursor-pointer"
                  onClick={() => {
                    setSaveButton(prev => !prev)
                    if (isSave) {
                      unSave(_id)
                      setSaveButton(false)
                      setIsSave(false)
                    } else {
                      setIsSave(prev => !prev)
                      postSave(_id)
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

                  <p className="hidden sm:block">{isSave ? "Saved" : "Save"}</p>
                </li>
                <li
                  className="flex gap-2 border-b-0 cursor-pointer"
                  onClick={() => {
                    setOpenComment(prev => !prev), scrollToComment()
                  }}
                >
                  <LuMessageCircle
                    size={20}
                    className="opacity-50 hover:opacity-100"
                  />
                  <button className="hidden sm:block">Comment</button>
                </li>
                <div
                  className="hidden sm:flex gap-2 border-b-0 cursor-pointer"
                  onClick={() => reportPost(_id)}
                >
                  <CgDanger
                    size={20}
                    className="opacity-50 hover:opacity-100"
                  />
                  <p>
                    {isReporting ? "reporting..." :  `${isReported ? "reported" : "report"}`}
                  </p>
                </div>
                <div
                  className="flex sm:hidden gap-2 border-b-0 cursor-pointer"
                  onClick={() => reportPost(_id)}
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
                {comments?.length > 0 && (
                  <li className="hidden md:block ">
                    <button
                      className="mb-3 text-left"
                      onClick={() => setOpenCommentSection(prev => !prev)}
                    >
                      {comments.length === 1 ? (
                        <p onClick={scrollToCommentSection}>View 1 comment</p>
                      ) : (
                        <p onClick={scrollToCommentSection}>
                          View all {comments.length} comments{" "}
                        </p>
                      )}
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div
            className={`flex w-[100%] relative ${
              openComment ? "h-[100px] mb-4" : "h-[0px]"
            } overflow-y-hidden transition-height `}
          >
            <textarea
              name=""
              id={uuidv4()}
              value={userComment}
              ref={commentScrollRef}
              placeholder="Type your comment"
              className={`
              md:text-[15px] text-[12px] 
                h-[100px] pl-4 pr-16 py-4 
              transition-all w-[100%] outline-none border-2 border-borderClr rounded-[18px] bg-borderClr`}
              onChange={e => setUserComment(e.target.value)}
            ></textarea>
            <button
              className="absolute right-6 top-[50%] submitBtn border-2 translate-y-[-50%] h-8 w-8 flex items-center justify-center rounded-[6px] "
              onClick={() => postComment(_id)}
            >
              <BsSend />
            </button>
          </div>
          {isCommentSending && (
            <div className="flex items-center justify-center mb-3">
              {" "}
              <Spinner height={"h-full"} width={"h-full"} /> Posting Comment...
            </div>
          )}
          {isDeleting && (
            <div className="flex items-center justify-center mb-3">
              {" "}
              <Spinner height={"h-full"} width={"h-full"} /> Deleting Comment...
            </div>
          )}
          <div className="w-[100%]">
            {comments?.length > 0 && (
              <div ref={commentSectionScrollRef} className="w-full">
                <div className="md:hidden px-1 block mb-5 w-full">
                  <button
                    className={`${
                      openCommentSection ? "mb-5" : "mb-0"
                    } text-left w-full`}
                    onClick={() => setOpenCommentSection(prev => !prev)}
                  >
                    {comments.length === 1 ? (
                      <div className="flex justify-start items-center gap-2">
                        <p
                          onClick={scrollToCommentSection}
                          className="flex-shrink-0"
                        >
                          View 1 comment
                        </p>
                        <div className="h-[1px] opacity-50 bg-white w-full"></div>
                      </div>
                    ) : (
                      <div className="flex justify-start items-center gap-2">
                        <p
                          onClick={scrollToCommentSection}
                          className="flex-shrink-0"
                        >
                          View all {comments.length} comments{" "}
                        </p>
                        <div className="h-[1px] opacity-50 bg-white w-full"></div>
                      </div>
                    )}
                  </button>
                </div>
                {openCommentSection && (
                  <div>
                    <div className="flex gap-2 mt-[-2rem] px-2 items-center">
                      <p className=" flex items-center gap-2">
                        Comments{" "}
                        {
                          <BsArrowDown
                            className="opacity-60"
                            strokeWidth={1}
                            size={15}
                          />
                        }
                      </p>
                      <div className="hidden md:block h-[1px] opacity-50 bg-white w-full"></div>
                    </div>
                    <div
                      className={` overflow-hidden  mt-1 rounded-[18px] bg-borderClr flex flex-col`}
                    >
                      <div className="max-h-[300px] overflow-y-scroll">
                      {comments.map((comment, index) => {
                          return (
                            <Comment
                              key={comment._key}
                              shadow={"lg"}
                              index={index}
                              user={user}
                              pinId={_id}
                              userCommentDetails={{ ...comment }}
                              deleteToggle={deleteToggle}
                              fetchComments={fetchComments}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PinLayout
