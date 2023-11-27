import { useState, useEffect } from "react"
import logo from "../assets/Logo (1) 2.svg"
import { Link } from "react-router-dom"

const Spinner = ({ login, message, height, width, isSetTimeoutToggle }) => {
  const [showLink, setShowLink] = useState(false)

  useEffect(() => {
    if (isSetTimeoutToggle) {
      const timeoutId = setTimeout(() => {
        setShowLink(true)
      }, 10000)

      return () => clearTimeout(timeoutId)
    }
  }, [isSetTimeoutToggle])

  return (
    <div
      className={`${height ? `h-[${height}]` : "h-[100vh]"} w-[${
        width ? width : "100vh"
      }] flex justify-center items-center flex-col `}
    >
      <img src={logo} alt="" className="animate-pulse" />
      {!showLink && message} 
      {login && (
        <Link
          to="/login"
          className="px-4 py-2 bg-borderClr font-semibold mt-3 opacity-70 hover:opacity-100 rounded-[18px]"
        >
          Login
        </Link>
      )}
      {showLink && (
        <div className="flex items-center flex-col">
          <p>User doesn't exist please log in to continue</p>
          <Link
            to="/login"
            className="px-4 py-2 bg-borderClr font-semibold mt-3 opacity-70 hover:opacity-100 rounded-[18px]"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  )
}

export default Spinner
