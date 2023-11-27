import PinLayout from "./PinLayout"
import Spinner from "../Spinner"
import { useEffect, useState, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import { feedQuery, pinDetailMorePinQuery, searchQuery } from "../../Data/query"
import { client } from "../../client"
import { BiRefresh } from "react-icons/bi"
import { FaExpand } from "react-icons/fa6"

const Feed = ({ user, searchValue, fetchFeed }) => {
  const [pins, setPins] = useState([])
  const [loading, setLoading] = useState([])
  const { categoryId } = useParams()
  const isPostOverRef = useRef(false)

  const [pinCount, setPinCount] = useState(20)

  function fetchFeeds() {
    console.log("Hello")
    setLoading(true)
    if (searchValue != "") {
      const query = searchQuery(searchValue)
      client.fetch(query).then(data => {
        setPins(data)
        setLoading(false)
      })
    } else if (categoryId) {
      const pin = {
        _id: user._id,
        category: categoryId,
      }
      const query = pinDetailMorePinQuery(pin)
      client.fetch(query).then(data => {
        setPins(data)
        setLoading(false)
      })
    } else {
      client.fetch(feedQuery).then(data => {
        setPins(data)
        setLoading(false)
      })
    }
  }
  const toggleFullScreen = () => {
    const rootElement = document.querySelector("#root")
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      rootElement.requestFullscreen()
    }
  }

  useEffect(() => {
    if (categoryId) {
      document.title = `Dmxzt - ${categoryId}`
    } else if (searchValue === "") {
      document.title = `Dmxzt - Home`
    } else {
      document.title = `Dmxzt - ${searchValue}`
    }
    setLoading(true)
    fetchFeeds()
  }, [categoryId, searchValue])

  if (loading) {
    return <Spinner message={"feed"} width={"100%"} />
  }

  if (pins?.length === 0) {
    return (
      <p className="pt-5 font-semibold text-center">
        {" "}
        No pins are available for this category{" "}
      </p>
    )
  }
  if (!user) {
    return (
      <div className="text-center dvh-class font-poppins absolute top-[0] w-[100%] overflow-y-scroll bg-dzBg">
        <p>To see the feed you must login</p>
        <Link to="/login" className="underline pt-5">
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="dvh-class  font-poppins pt-[8vh]  items-center absolute top-[0] w-[100%] overflow-y-scroll flex flex-col  bg-dzBg">
      <BiRefresh
        size={30}
        className="cursor-pointer right-0  w-[35px] h-[35px] p-1 rounded-bl-lg bg-slate-800 border-2 border-border2Clr absolute  top-[7.8vh] hover:bg-border2Clr "
        onClick={fetchFeeds}
      />
      <button className="cursor-pointer sm:hidden flex items-center justify-center bg-slate-800 z-[200] rounded-tl-lg w-[35px] h-[35px] p-1  border-2  fixed bottom-[-1px] right-0 border-border2Clr hover:bg-border2Clr " onClick={toggleFullScreen}>
        <FaExpand size={20}/>
      </button>
      
      {pins &&
        pins.map((pin, index) => {
          if (index < pinCount) {
            if (index + 1 === pins.length) {
              isPostOverRef.current = true
            }
            return (
              <PinLayout
                title={pin?.title}
                key={pin?._id}
                image={pin?.image?.asset?.url}
                about={pin?.about}
                category={pin?.category}
                userImg={pin?.postedBy?.image?.asset?.url}
                username={pin?.postedBy?.username}
                _id={pin?._id}
                user={user}
                userId={pin?.userId}
                likes={pin?.like}
                save={pin?.save}
                postedBy={pin?.postedBy}
              />
            )
          }
        })}
      {isPostOverRef.current ? (
        <p className="sm:mb-5 mb-28 px-2 py-1 mt-5 bg-border2Clr rounded-full">
          You have reached end {":)"}
        </p>
      ) : (
        <button
          className="sm:mb-5 mb-28 px-2 py-1 mt-5 bg-border2Clr rounded-full"
          onClick={() => setPinCount(prev => Math.min(prev + 20, pins.length))}
        >
          Load more
        </button>
      )}
    </div>
  )
}

export default Feed
