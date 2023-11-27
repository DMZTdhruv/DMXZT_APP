import { useState, useEffect } from "react"
import { client, urlFor } from "../../client"
import { AiFillDelete, AiFillHeart, AiOutlineDelete } from "react-icons/ai"
import { Link } from "react-router-dom"
import { FaBookmark } from "react-icons/fa"
import { BsThreeDotsVertical } from "react-icons/bs"
import { v4 as uuidv4 } from "uuid"
import ImageComponent from "./ImageComponent"
import { userQuery } from "../../Data/query"
import { jwtDecode } from "jwt-decode"

const PinSecondLayout = ({
  pin,
  user,
  isAdmin,
  userDetailsFunc,
  isDeletingFunc,
  isSavingFunc,
  savedPinsFunc,
}) => {

  const { postedBy, title, _id, image, like, save } = pin

  // like counter
  const [likeCounter, setLikeCounter] = useState(0)
  const [likeAnimation, setLikeAnimation] = useState(false)
  const [isAlreadyLiked, setIsAlreadyLiked] = useState(false)

  //save state
  const [saveButton, setSaveButton] = useState(false)
  const [isSave, setIsSave] = useState(false)

  const [toggleOptions, setToggleOptions] = useState(false)

  //loading states

  useEffect(() => {
    setLikeCounter(like?.length)

    if (like === null) {
      setIsAlreadyLiked(false)
      setLikeAnimation(false)
      setLikeCounter(0)
    } else {
      setIsAlreadyLiked(
        !!like?.filter(e => e.userId === user.currUserGoogleId)?.length
      )
    }

    setToggleOptions(false)
    if (save === null) {
      setIsSave(false)
      setSaveButton(false)
    } else {
      setIsSave(!!save.filter(e => e.userId === user.currUserGoogleId)?.length)
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
            _ref: user.CurrUserProfileId,
          },
        },
      ])
      .commit()
  }

  const deletePin = id => {
    isDeletingFunc()
    client.delete(id).then(() => {
      userDetailsFunc(user.currUserGoogleId)
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
        setLikeCounter(prev => prev + 1)
        setLikeAnimation(true)
        setIsAlreadyLiked(true)
      })
  }

  const unSave = pinId => {
    isSavingFunc(true)
    client
      .patch(pinId)
      .unset([`save[userId == "${user.currUserGoogleId}"]`])
      .commit()
      .then(() => {
        savedPinsFunc(user._id)
      })
      .catch(error => {
        console.error("Error removing like:", error)
        setSaveButton(true)
        setIsSave(true)
      })
  }

  return (
    <div className="text-[12px] md:text-[15px]  group mb-5 h-auto flex relative items-center rounded-lg overflow-hidden justify-center">
      <Link to={`/pin-detail/${pin._id}`}>
        <div
          className={`-full h-full absolute bg-black opacity  y-0 group-hover:opacity-5`}
        ></div>
        <ImageComponent HighQualityImage={urlFor(image).width(500).url()} lowImageQuality={urlFor(image).width(10).url()} className={"h-auto w-[500px]"}/>
      </Link>
      <div
        className={`user-icon-top-left absolute md:translate-x-[-140%] ${
          toggleOptions ? "translate-x-0" : "translate-x-[-140%]"
        }  md:group-hover:translate-x-0 transition-all top-2 left-3`}
      >
        <Link
          to={`/user-profile/${pin?.userId}`}
          className="w-[34px] h-[34px]  rounded-full"
        >
          <button
            className={`p-2 rounded-full h-[44px] w-[44px] bg-borderClr md:bg-borderClr shadow-md flex items-center justify-center`}
          >
            <img
              src={postedBy?.image?.asset?.url}
              className="h-full w-full object-cover rounded-full"
              alt=""
              loading="lazy"
            />
          </button>
        </Link>
      </div>
      <div className="save-option-top-right absolute top-2 right-3">
        <button
          className={`p-3 rounded-full bg-borderClr md:bg-border2Clr hover:bg-borderClr md:translate-x-[140%] ${
            toggleOptions ? "translate-x-[0%]" : "translate-x-[140%]"
          }   md:group-hover:translate-x-0 transition-all shadow-md flex items-center justify-center`}
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
            strokeWidth={45}
            className={`${
              saveButton | isSave
                ? "animation-buttons fill-cyan-600 stroke-cyan-600"
                : "fill-transparent opacity-50"
            } transition-all  `}
          />
        </button>
      </div>
      <div className="title-option-top-right absolute bottom-11 left-3">
        <button
          className="px-2 md:hidden py-2 font-semibold rounded-full bg-borderClr transition-all shadow-md flex items-center justify-center"
          onClick={() => setToggleOptions(prev => !prev)}
        >
          <BsThreeDotsVertical />
        </button>
      </div>
      <div className="title-option-top-right absolute bottom-2 left-3">
        <button className="px-3 py-1 font-semibold rounded-full bg-borderClr transition-all shadow-md flex items-center justify-center">
          {title}
        </button>
      </div>
      <div className="title-option-top-right absolute bottom-2 left-3">
        <button className="px-3 py-1 font-semibold rounded-full bg-borderClr transition-all shadow-md flex items-center justify-center">
          {title}
        </button>
      </div>
      {isAdmin && (
        <div className="bottom-[55px] absolute right-3">
          <button
            className={`p-3 rounded-full bg-borderClr md:bg-border2Clr hover:bg-borderClr md:translate-x-[140%] ${
              toggleOptions ? "translate-x-[0%]" : "translate-x-[140%]"
            }   md:group-hover:translate-x-0 transition-all shadow-md flex items-center justify-center`}
            onClick={() => deletePin(_id)}
          >
            <AiFillDelete
              size={18}
              stroke="white"
              fill="transparent"
              strokeWidth={100}
            />
          </button>
        </div>
      )}
      <div className="bottom-right-like-button absolute bottom-2 right-3 ">
        <button
          className={`p-2 relative md:bg-border2Clr bg-borderClr md:hover:bg-borderClr md:translate-y-[140%] ${
            toggleOptions ? "translate-y-[0%]" : "translate-y-[140%]"
          }   md:group-hover:translate-y-0 transition-all shadow-md rounded-full`}
          onClick={() => {
            if (isAlreadyLiked) {
              unLike(_id)
              setLikeCounter(prev => prev - 1)
              setLikeAnimation(false)
              setIsAlreadyLiked(false)
            } else {
              postLike(_id)
              setLikeAnimation(prev => !prev)
              setLikeCounter(prevCount => prevCount + 1)
              setIsAlreadyLiked(prev => !prev)
            }
          }}
        >
          <AiFillHeart
            size={25}
            fill={"transparent"}
            strokeWidth={80}
            className={`${
              likeAnimation | isAlreadyLiked
                ? "animation-buttons fill-pink-600 stroke-pink-600"
                : "fill-transparent opacity-50"
            } transition-all `}
          />

          <p className="absolute font-semibold top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-[10px]">
            {likeCounter}
          </p>
        </button>
      </div>
    </div>
  )
}

export default PinSecondLayout
