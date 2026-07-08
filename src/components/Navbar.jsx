import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { logoutUser } from "../store/authSlice";
import { User } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser, isLoggingIn } = useSelector((state) => state.auth);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setShowPopup(false);
      navigate("/login");
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

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
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowPopup(true);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Logout Confirmation Popup */}
      {showPopup && (
        <div>
          <div>
            <p>Are you sure you want to logout?</p>
            <div>
              <button
                onClick={() => setShowPopup(false)}
                disabled={isLoggingIn}
              >
                No
              </button>
              <button onClick={handleLogout} disabled={isLoggingIn}>
                {isLoggingIn ? "Logging out..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
