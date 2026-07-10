import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import LogoutModal from "./LogoutModal";

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
      <nav>
        {/* Logo */}
        <Link to={authUser ? "/chat" : "/login"}>ChatApp</Link>

        {/* logged out */}
        {!authUser && (
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        )}

        {/* logged in */}
        {authUser && (
          <div ref={dropdownRef}>
            {/* username with icon */}
            <div>
              <User size={18} />
              <span>{authUser.fullName}</span>
            </div>

            {/* settings button */}
            <button onClick={() => setShowDropdown(!showDropdown)}>⚙️</button>

            {/* dropdown */}
            {showDropdown && (
              <div>
                <Link to="/profile" onClick={() => setShowDropdown(false)}>
                  Update Profile
                </Link>

                {/* opens the modal */}
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    document.getElementById("logout_modal").showModal();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Logout Modal — separate component */}
      <LogoutModal />
    </>
  );
};

export default Navbar;
