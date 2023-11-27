import { useNavigate } from "react-router-dom"
import logo from "../assets/Logo (1) 2.svg"
import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { client } from "../client"
import { userQuery } from "../Data/query"
import LoginScreen from "../assets/Comp 1.mp4"
import { useEffect } from "react"

export const Login = () => {
  const navigate = useNavigate()

  useEffect(()=>{
    document.title = `Dmxzt - login`
  })

  const createUser = response => {

    const { name, sub, picture, email } = jwtDecode(response?.credential)
    localStorage.setItem("dmxzt-user", response?.credential)
    client.fetch(userQuery(sub)).then(data => {
      if (data?.length === 0) {
        const doc = {
          _id: sub,
          _type: "user",
          username: name,
          gmail: email,
          image: picture,
        }
        client.createIfNotExists(doc).then(() => {
          navigate(`/user-page/${sub}`, { replace: true })
        })
      } else {
        navigate(`/`, { replace: true })
      }
    })
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative h-full w-full">
        <video
          src={LoginScreen}
          autoPlay
          loop
          muted
          className="h-[100%] w-[100%] object-cover"
        ></video>
      </div>
      <div className="absolute h-full w-full flex gap-3 justify-center items-center flex-col top-0 right-0 left-0 bottom-0 bg-blackOverlay">
        <img src={logo} width="130px" alt="logo" />
        <GoogleLogin
          onSuccess={response => createUser(response)}
          onError={() => console.log("Error logging in")}
        />
      </div>
    </div>
  )
}
