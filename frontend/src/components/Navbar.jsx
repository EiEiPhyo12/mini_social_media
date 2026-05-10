import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import API from "../services/api";
function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      API.get("/profile")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="
      sticky top-0
      z-50
      bg-white
      shadow-sm
    ">
      <div className="
        max-w-7xl
        mx-auto
        px-4
        py-3
        flex
        items-center
        justify-between
      ">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="text-xl font-bold text-blue-900 cursor-pointer"
        >
          SocialNest
        </div>

        {/* SEARCH BAR */}
        <div className="
          hidden md:flex
          items-center
          bg-slate-100
          px-3
          py-2
          rounded-full
          w-1/3
        ">
          <Search size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="
              bg-transparent
              outline-none
              ml-2
              w-full
              text-sm
            "
          />
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">

          {/* NOTIFICATIONS */}
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <Bell size={20} />
          </button>

          {/* LOGIN / LOGOUT */}
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-blue-900
                  hover:bg-slate-100
                  rounded-lg
                "
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="
                  px-4
                  py-2
                  text-sm
                  font-medium
                  bg-blue-900
                  text-white
                  rounded-lg
                  hover:opacity-90
                "
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="
                px-4
                py-2
                text-sm
                font-medium
                bg-red-500
                text-white
                rounded-lg
                hover:opacity-90
              "
            >
              Logout
            </button>
          )}

          {isLoggedIn && (
            <div
              onClick={() => navigate("/profile")}
              className="
      w-9
      h-9
      rounded-full
      overflow-hidden
      bg-blue-900
      text-white
      cursor-pointer
      border
      flex
      items-center
      justify-center
      font-semibold
      shrink-0
    "
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;