import { AiFillDelete, AiOutlineCloudUpload } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { client } from "../../client"
import Spinner from "../Spinner"
import { NavLinks } from "../../Data/navlinks"
import { useEffect, useRef, useState } from "react"

const CreatePin = ({ user }) => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [about, setAbout] = useState("")
  const [destination, setDestination] = useState("")
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState(false)
  const [imageAsset, setImageAsset] = useState(false)
  const [wrongImageType, setWrongTypeImage] = useState(false)
  const [fields, setFields] = useState(false)
  const [posting, setIsPosting] = useState(false)

  const postingRef = useRef(null)

  useEffect(()=>{
    document.title = "DMXZT - create-pin"
  })

  const savePin = () => {
    if (title && about && imageAsset?._id && category) {
      setIsPosting(true)
      const doc = {
        _type: "pin",
        title: title,
        about: about,
        destination: destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user.currUserGoogleId,
        postedBy: {
          _type: "postedBy",
          _ref: user.currUserProfileId,
        },
        category,
      }

      if(postingRef.current){
        postingRef.current.disabled = true
      }

      client.create(doc).then((data) => {
        navigate("/")
      })
    } else {
      setFields(true)
      setIsPosting(false)
      window.scrollTo({ top: 0, behavior: "smooth" })
      setTimeout(() => {
        setFields(false)
      }, 2000)
    }
  }
  const uploadImage = e => {
    const { name, type } = e.target.files[0]
    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/gif" ||
      type === "image/jpeg" ||
      type === "image/tiff"
    ) {
      setWrongTypeImage(false)
      setLoading(true)

      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then(data => {
          setImageAsset(data)

          setLoading(false)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      setWrongTypeImage(true)
    }
  }

  return (
    <div className="dvh-class font-poppins pt-[8vh] items-center absolute top-[0] w-[100%] overflow-y-scroll flex flex-col  bg-dzBg">
      <div className="flex font-poppins  pb-48 sm:pb-5 md:pb-8 justify-center md:p-5 px-2 w-full pt-5 flex-col items-center">
        <div className="flex md:w-[80%] w-[90%] items-center justify-center flex-col  text-white">
          <div className="bg-borderClr relative overflow-hidden flex-col items-center rounded-[18px] w-full md:h-420 h-340 flex justify-center flex-center ">
            {loading ? (
              <Spinner
                height={"100%"}
                width={"100%"}
                message={"uploading...."}
              />
            ) : (
              <>
                {wrongImageType && (
                  <p className="text-center p-2 h-[100px] flex items-center">
                    The image type you have provided is wrong..
                  </p>
                )}
                {!imageAsset ? (
                  <label className="w-full h-full p-5">
                    <div className="border-dotted border-2 w-full h-full flex flex-col justify-center items-center rounded-lg">
                      <div className="flex flex-col items-center justify-center">
                        <AiOutlineCloudUpload size={24} />
                        <p>Upload an image</p>
                      </div>
                      <p className=" mt-24 opacity-70 text-center p-2">
                        Recommended to upload high-quality JPEG / SVG / GIF /
                        TIFF of less than 20MB
                      </p>
                    </div>
                    <input
                      type="file"
                      name="uploadImage"
                      onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  </label>
                ) : (
                  <div className="image h-full flex flex-col items-center justify-center">
                    <img
                      src={imageAsset?.url}
                      className="md:h-[400px] h-[300px] z-[1] rounded-lg object-cover"
                    />
                    <button
                      className="absolute z-[9] bottom-3 right-3 rounded-full bg-white text-black p-2 opacity-70 hover:opacity-100 transition-all"
                      onClick={() => setImageAsset(null)}
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                )}
                {imageAsset?.url && (
                  <div
                    style={{ backgroundImage: `url(${imageAsset?.url})` }}
                    className="absolute opacity-30 top-0 z-[0] h-[100%] w-[100%] blur-md bg-[url] rounded-lg object-[center_50%] object-cover background-center"
                  />
                )}
              </>
            )}
          </div>
        </div>
        <div className="mt-5 gap-4 flex flex-col items-start md:w-[80%] w-[90%] ">
          <div className="w-full">
            <p className="pb-2 text-[21px] font-semibold">
              Details about your pin:{" "}
            </p>
            <input
              id="image-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter your title"
              className="w-[90%]  rounded-md outline-none text-white  bg-borderClr px-4 py-2  "
            />
          </div>
          <div className="w-full">
            <textarea
              id="image-description"
              value={about}
              onChange={e => setAbout(e.target.value)}
              placeholder="Enter your about/description"
              className="w-[90%] rounded-md outline-none text-white  bg-borderClr px-4 py-2  "
            />
          </div>
          <div className="w-full">
            <input
              id="image-destination"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              type="text"
              placeholder="Destination url [optional]"
              className="w-[90%] rounded-md outline-none text-white  bg-borderClr px-4 py-2  "
            />
          </div>
          <div className="w-full">
            <p className="font-semibold pb-2 text-[21px]">
              {" "}
              Choose pin category
            </p>
            <select
              value={category}
              id="select-category"
              className="w-[90%]  text-center rounded-md outline-none text-white  bg-borderClr px-4 py-2  "
              onChange={e => setCategory(e.target.value)}
            >
              <option value="other">Select-an-option</option>
              {NavLinks.map(e => {
                return (
                  <option key={e.name} value={e.name}>
                    {e.name}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="flex mt-5 items-center gap-5">
            <button
              ref={postingRef}
              className={`px-5 ${posting && "opacity-50"} transition-all py-2 mb-5 bg-white text-black rounded-full font-bold`}
              onClick={savePin}
            >
              {posting ? "Posting..." : "Post"}
            </button>
            {fields && (
              <p className="translate-y-[-10px] text-red-500 font-semibold ">
                Please enter the complete details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin
