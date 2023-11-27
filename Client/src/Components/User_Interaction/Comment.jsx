import { Link } from "react-router-dom"
import { client } from "../../client"
import { AiOutlineDelete, AiFillHeart } from "react-icons/ai"


const Comment = ({
  userCommentDetails,
  user,
  pinId,
  fetchComments,
  borderClr,
  shadow,
  deleteToggle,
}) => {


  const deleteComment = pinId => {
    deleteToggle()
    client
      .patch(pinId)
      .unset([`comment[_key == "${userCommentDetails?._key}"]`])
      .commit()
      .then(() => {
        fetchComments(pinId)
      })
      .catch(error => {
        console.error("Error removing like:", error)
      })
  }
  const submitReplyComment = () => {}

  return (
    <div
      className={`${
        borderClr === undefined ? "border-black" : `border-${borderClr}`
      } ${
        shadow === undefined ? "" : `shadow-${shadow}`
      } justify-between flex items-center border-b-2 px-4 py-4 gap-2 md:text-[15px] text-[12px]comment `}
    >
      <div className="comment-text  flex gap-3 w-full">
        <Link
          to={`/user-profile/${userCommentDetails?.id}`}
          className="flex-shrink-0 icon-wrapper md:max-h-[45px] md:max-w-[45px]  max-w-[40px] max-h-[40px] rounded-full overflow-hidden"
        >
          <img
            src={userCommentDetails.image}
            alt=""
            className="h-[45px] w-[45px] object-cover"
          />
        </Link>
        <div className="flex  transition-all flex-row gap-1 w-full justify-between items-center">
          <div className="flex-col flex">
            <Link
              to={`/user/${userCommentDetails?.postedBy?._ref}`}
              className=" font-semibold opacity-70 text-[12px]"
            >
              {userCommentDetails.username}
            </Link>
            <div className="comment-details">
              <p
                className="md:text-[15px] text-[13px] w-inherit max-w-[180px] sm:max-w-[480px] xl:max-w-[500px]"
                style={{ wordWrap: "break-word" }}
              >
                {userCommentDetails.userComment}
              </p>
              <p className="text-[10px] opacity-50">{userCommentDetails?.date}</p>
            </div>
          </div>
        </div>
        {userCommentDetails?.id === user.currUserGoogleId && (
          <button
            className="pt-1 flex items-center gap-1 opacity-50 hover:opacity-100 transition-all"
            onClick={() => deleteComment(pinId)}
          >
            <AiOutlineDelete />
          </button>
        )}
      </div>
    </div>
  )
}

export default Comment
