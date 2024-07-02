import { Link, Outlet, useNavigate } from "react-router-dom";
import { Search, FileEdit, Bell } from "lucide-react";
import logo from "../assets/pearl.svg";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";

const Navbar = () => {
  const [searchBoxVisibility, setSeachBoxVisibility] = useState(false);

  const [userNavPanel, setUserNavPanel] = useState(false);

  const {
    userAuth,
    userAuth: { access_token, profile_img },
  } = useContext(UserContext);
  const navigate = useNavigate();
  const handleUserNavPanel = () => {
    setUserNavPanel((curr) => !curr);
  };
  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  const handleSearch = (e) => {
    let query = e.target.value;
    if (e.keyCode == 13 && query.length) {
      navigate(`/search/${query}`);
    }
  };

  return (
    <>
      <nav className="navbar ">
        <Link to={"/"} className="flex items-center">
          <img
            src={logo}
            alt="brand logo"
            className=" h-10 md:h-12 object-contain"
          />
          {/* <span className="text-2xl font-bold">Pearl</span> */}
        </Link>

        <div
          className={`absolute w-full bg-zinc-50 left-0 top-full mt-0 border-b border-zinc-200 py-4 px-[5vw] md:border-none md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${
            searchBoxVisibility ? "show" : "hide"
          } `}
        >
          <input
            type="text"
            placeholder="Search"
            className=" w-full bg-zinc-100 md:w-auto p-3 pl-6 pr-[12%] md:pr-6 rounded-xl border border- border-zinc-200 placeholder:text-zinc-600 md:pl-12"
            onKeyDown={handleSearch}
          />
          <Search
            width={18}
            className="text-zinc-600 absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2"
          />
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-zinc-100 rounded-full w-12 h-12 flex items-center justify-center"
            onClick={() => setSeachBoxVisibility(!searchBoxVisibility)}
          >
            <Search width={18} />
          </button>

          <Link
            to={"/editor"}
            className="hidden md:flex items-center px-6 py-3 gap-2 link rounded-xl"
          >
            <FileEdit width={18} className="text-zinc-600 pb-0.5" />
            <p className="text-zinc-600">Write</p>
          </Link>
          {access_token ? (
            <>
              {/* <Link to={"/dashboard/notification"}>
                <button className="w-12 h-12 rounded-full  border border-zinc-200 bg-zinc-100 relative hover:bg-zinc-200">
                  <Bell width={18} className="mx-auto text-zinc-800" />
                </button>
              </Link> */}

              <div
                className="relative"
                onClick={handleUserNavPanel}
                onBlur={handleBlur}
              >
                <button className="w-12 h-12 bt-1 border border-zinc-200 rounded-full">
                  <img
                    src={profile_img}
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to={"/signin"} className="btn-dark py-2 ">
                Sign In
              </Link>
              <Link to={"/signup"} className="hidden md:block btn-light py-2 ">
                Sign Up
              </Link>
            </>
          )}
          {userNavPanel && <UserNavigationPanel />}
        </div>
      </nav>
      <Outlet />
    </>
  );
};
export default Navbar;
