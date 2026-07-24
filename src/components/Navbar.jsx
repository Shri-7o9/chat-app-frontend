import { useSelector } from "react-redux";
import { Link } from "react-router";
import { Settings, LogOut } from "lucide-react";
import LogoutModal from "./LogoutModal";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="navbar bg-base-100 shadow-lg" data-theme="corporate">
        <nav className="flex items-center justify-between w-full px-4">
          {/* Logo */}
          <Link
            to={authUser ? "/" : "/login"}
            className="group text-3xl font-bold cursor-pointer inline-block
              transition-all duration-300
              hover:scale-110"
          >
            <span className="text-black transition-colors duration-300 group-hover:text-blue-500">
              Chat
            </span>
            <span className="text-blue-500 transition-colors duration-300 group-hover:text-black">
              App
            </span>
          </Link>

          {/* Logged Out */}
          {!authUser && (
            <div className="flex gap-3">
              <Link to="/login">
                <a
                  className="btn rounded-full text-primary border-primary bg-transparent
                     hover:bg-primary hover:text-primary-content hover:scale-110
                     transition-all duration-300"
                >
                  Login
                </a>
              </Link>
              <Link to="/signup">
                <a
                  className="btn rounded-full text-secondary border border-secondary bg-transparent
                     hover:bg-secondary hover:text-secondary-content hover:scale-110
                     transition-all duration-300"
                >
                  Sign Up
                </a>
              </Link>
            </div>
          )}

          {/* Logged In */}
          {authUser && (
            <div className="flex items-center gap-4">
              {/* Username */}
              <div className="flex items-center gap-2">
                <img
                  src={authUser.profilePic || "/avatar-placeholder.png"}
                  alt={authUser.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{authUser.fullName}</span>
              </div>

              {/* Settings Dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle transition-all duration-300 hover:rotate-90"
                >
                  <Settings className="w-6 h-6" />
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow border border-gray-300 space-y-1"
                >
                  <li>
                    <Link
                      to="/profile"
                      className="bg-gray-300 hover:bg-gray-500 hover:text-white transition-all duration-200 hover:scale-105"
                    >
                      Update Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/change-password"
                      className="bg-gray-300 hover:bg-gray-500 hover:text-white transition-all duration-200 hover:scale-105"
                    >
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <button
                      className="flex items-center gap-2 text-error bg-gray-300 hover:text-white hover:bg-red-300 transition-all duration-200 hover:scale-105 font-semibold"
                      onClick={() =>
                        document.getElementById("logout_modal").showModal()
                      }
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Logout Modal */}
      <LogoutModal />
    </>
  );
};

export default Navbar;
