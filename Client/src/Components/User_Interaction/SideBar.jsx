import logo from "../../assets/Logo (1) 2.svg"
import { AiOutlineHome } from "react-icons/ai"
import { AiOutlineSearch } from "react-icons/ai"
import { BsArrowUpRight } from "react-icons/bs"
import { Link, NavLink } from "react-router-dom"
import { AiOutlineClose } from "react-icons/ai"
import { NavLinks } from "../../Data/navlinks"

const SideBar = ({ user, openSideBar, funcToggleSidebar, searchValueFunc }) => {
  const isActiveClass =
    "translate-x-2 transition-all font-bold cursor-pointer opacity-100 flex items-center gap-3"
  const isNotActiveClass =
    "hover:translate-x-2 transition-all font cursor-pointer opacity-70 hover:opacity-100 flex items-center gap-3"

  const navlinks = [...NavLinks]
  navlinks.pop()

  return (
    <>
      <div
        className={`lg:bg-transparent bg-dzBg lg:relative w-[23vw] min-w-[330px] fixed z-[999]  px-[35px] lg:translate-x-0 ${
          openSideBar ? "translate-x-[0]" : "translate-x-[-110%]"
        } transition-transform h-[100vh] py-[26px]  gap-[44px] flex flex-col items-start border-r-2 border-borderClr`}
      >
        <div className=" logo-row flex items-center">
          <div className="logo translate-x-[-10px] cursor-pointer">
            <img
              src={logo}
              alt=""
              onClick={() => {
                funcToggleSidebar()
                searchValueFunc("")
              }}
            />
          </div>
          <div
            className="brand-name font-LexendDeca translate-x-[-10px] text-[30px] uppercase"
            onClick={() => {
              funcToggleSidebar()
              searchValueFunc("")
            }}
          >
            <Link to="/">dmxzt</Link>
          </div>
          <button
            className="lg:hidden absolute right-8  px-2 py-2 rounded-full hover:bg-borderClr"
            onClick={() => {
              funcToggleSidebar()
              searchValueFunc("")
            }}
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        <div className="nav-links flex flex-col gap-4">
          <h2 className="font-tomorrow text-[25px] font-bold">Start Here</h2>
          <div className="links flex flex-col gap-3 font-poppins">
            <span
              className="hover:translate-x-2 transition-all cursor-pointer opacity-70 hover:opacity-100 flex items-center gap-2"
              onClick={() => {
                funcToggleSidebar()
                searchValueFunc("")
              }}
            >
              <AiOutlineHome />
              <Link to="/">Home</Link>
            </span>
            {user && (
              <span
                className="hover:translate-x-2 transition-all cursor-pointer opacity-70 hover:opacity-100 flex gap-2 items-center"
                onClick={() => {
                  funcToggleSidebar()
                  searchValueFunc("")
                }}
              >
                <AiOutlineSearch /> <Link to="/explore">explore</Link>
              </span>
            )}
          </div>
          {user ? (
            <span
              className="hover:translate-x-2 transition-all mt-[-5px] cursor-pointer opacity-70 hover:opacity-100 flex gap-2 items-center"
              onClick={funcToggleSidebar}
            >
              <BsArrowUpRight />
              <Link to="/create-pin">Post</Link>
            </span>
          ) : (
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
          )}
        </div>
        {user && (
          <div className="category flex flex-col gap-4">
            <h3 className="font-tomorrow text-[25px] font-bold">Categories</h3>
            <div className="category-links">
              <ul className="flex flex-col gap-4 overflow-x-hidden font-poppins w-[250px] max-h-[30vh] overflow-auto">
                {navlinks.map(e => {
                  return (
                    <NavLink
                      key={e.name}
                      to={`category/${e.name}`}
                      className={({ isActive }) =>
                        isActive ? isActiveClass : isNotActiveClass
                      }
                      onClick={() => {
                        funcToggleSidebar()
                        searchValueFunc("")
                      }}
                    >
                      <div className="category-image h-[32px] w-[32px] overflow-hidden rounded-full object-cover">
                        <img
                          src={e.imgUrl}
                          alt=""
                          className="h-[100%] w-[100%] object-cover object-center"
                        />
                      </div>
                      <p>{e.name}</p>
                    </NavLink>
                  )
                })}
              </ul>
            </div>
          </div>
        )}
        {user && (
          <Link
            to={`/user-profile/${user.currUserGoogleId}`}
            className="user flex  items-center gap-3 px-3 py-2 w-[100%] bg-buttonClr rounded-[18px] hover:bg-buttonClrHover transition-colors cursor-pointer"
            onClick={funcToggleSidebar}
          >
            <div className="user-img min-h-[52px] h-[52px] w-[52px] min-w-[52px] max-h-[100px] max-w-[100px] overflow-hidden rounded-full">
              <img
                src={user?.image}
                alt=""
                className="h-[100%] w-[100%] object-cover"
              />
            </div>
            <div className="user-info font-poppins overflow-auto">
              <div className="user-name">{user?.username}</div>
              <p>Account</p>
            </div>
          </Link>
        )}
      </div>
    </>
  )
}

export default SideBar
