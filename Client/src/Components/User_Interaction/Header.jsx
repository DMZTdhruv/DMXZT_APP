import React from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { HiMenu } from "react-icons/hi"
import logo from "../../assets/Logo (1) 2.svg"
import { Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"



const Header = ({ toggleSideBar ,  user, searchFunc, searchValue }) => {
 
  const decode = localStorage.getItem("dmxzt-user")
  const decoded = jwtDecode(decode)
  const userId = decoded.sub;

  const handleSearchChange = (e) => {
    searchFunc(e.target.value);
  }
 
  return (
    <div className="px-[10px] header w-[100vw] z-10 relative flex items-center lg:justify-between justify-center lg:w-[60vw]  md:w-[85vw] bg-transparent h-[8vh] border-b-2 border-borderClr ">
      <button
        className=" rounded-full border-full hover:bg-borderClr px-2 py-2 lg:hidden block relative"
        onClick={toggleSideBar}
      >
        <HiMenu size={24} className="opacity-80 hover:opacity-100" />
      </button>
      

      <div className="bar flex items-center justify-center w-[80%] lg:w-[100%]">
        {user ? (
          <>
            <input
              id="searchBar"
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              className="w-[50%] rounded-l-[18px] bg-transparent border-2 border-r-0 hover:bg-borderClr transition-all outline-none focus:bg-borderClr text-[15px] font-semibold font-poppins border-borderClr px-5 py-1 text-white"
              placeholder="search"
            />
            <button className="px-5 text-center py-1 rounded-r-[18px] font-semibold font-poppins border-2 border-borderClr">
              <AiOutlineSearch
                fontSize={22.5}
                className=" opacity-70 hover:opacity-100 transition-opacity"
              />
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-borderClr font-semibold opacity-70 hover:opacity-100 rounded-[18px] mx-4"
          >
            Login
          </Link>
        )}
      </div>

      <div className=" lg:hidden logo translate-x-[-10px] flex items-center ">
       
        <Link to="/">
          <img src={logo} alt="" />
        </Link>
        {user && (
          <Link to={`/user-profile/${userId}`}>
            <div className="overflow-hidden user-icon h-[34px] w-[34px] object-cover rounded-full">
              <img src={user?.image} alt="" className="h-[34px] w-[34px] object-cover"/>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Header