import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { BsArrowUpRight } from "react-icons/bs"
import logo from "../../assets/Logo (1) 2.svg"

const UserSection = ({ user, searchValueFunc }) => {
  if (user) {
    return (
      <div className="border-l-2 border-border2Clr relative bg-transparent overflow-hidden h-screen gap-4 lg:w-[25vw]  w-[15vw] md:flex flex-col items-center hidden">
        <div className="overlay h-full w-full bg-gradient-to-b from-border2Clr opacity-80  to-borderClr absolute top-0 left-0 z-[1]"></div>
        <img
          src={`${user?.banner?.asset?.url}`}
          className="absolute top-0 left-0 h-screen w-full object-cover z-[0] blur-sm"
          style={{ objectPosition: `50% center` }}
        ></img>
        <div className="div absolute top-0 left-0 z-[3] flex flex-col items-center py-[26px] gap-4 w-full">
          <Link
            to={`/user-profile/${user.currUserGoogleId}`}
            className="user flex w-[90%] items-center flex-wrap xl:justify-center justify-evenly gap-3 xl:px-5 py-2 bg-buttonClr rounded-[18px] hover:bg-buttonClrHover transition-colors cursor-pointer px-2"
          >
            <div className="user-img min-h-[52px]  min-w-[52px]  max-h-[75px] max-w-[75px] overflow-hidden rounded-full">
              <img
                src={user?.image}
                alt=""
                className="h-[75px] w-[75px] object-cover"
                style={{ objectPosition: `50% 50%` }}
              />
            </div>
            <div className="hidden xl:block user-info font-poppins overflow-auto">
              <div className="user-name">{user?.username}</div>
              <p>Your profile</p>
            </div>
          </Link>
          <Link
            to={`/create-pin`}
            className="user flex xl:justify-between justify-center xl:items-center gap-3 px-5 py-2 bg-buttonClr rounded-[18px] hover:bg-buttonClrHover transition-colors cursor-pointer min-w-[90%]"
          >
            <div className="user-info font-poppins">
              <p>Post</p>
            </div>
            <p className="xl:block hidden">
              <BsArrowUpRight />
            </p>
          </Link>
          <div
            className="logo translate-x-[-10px] cursor-pointer"
            onClick={() => searchValueFunc("")}
          >
            <img src={logo} alt="" />
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className=" border-l-2 border-borderClr h-screen gap-4 lg:w-[25vw] py-[26px] w-[15vw] md:flex flex-col items-center hidden">
        <div className="logo translate-x-[-10px]">
          <img src={logo} alt="" />
        </div>
        <Link
          to="/login"
          className="user flex xl:justify-between justify-center xl:items-center gap-3 px-5 py-2 bg-buttonClr rounded-[18px] hover:bg-buttonClrHover transition-colors cursor-pointer min-w-[90%]"
        >
          <div className="user-info font-poppins">
            <p>Login</p>
          </div>
          <p className="xl:block hidden">
            <BsArrowUpRight />
          </p>
        </Link>
      </div>
    )
  }
}
export default UserSection
