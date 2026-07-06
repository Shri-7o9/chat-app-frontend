import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { logoutUser } from "../store/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const dropdownRef = useRef(null);

  // close dropdown when clicking outside
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
        {/* Logo — always visible */}
        <Link to={user ? "/" : "/login"}>ChatApp</Link>

        {/* logged out — show login and signup links */}
        {!user && (
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        )}

        {/* logged in — show settings dropdown */}
        {user && (
          <div ref={dropdownRef}>
            {/* Settings icon button */}
            <button onClick={() => setShowDropdown(!showDropdown)}>⚙️</button>

            {/* Dropdown */}
            {showDropdown && (
              <div>
                {/* Update Profile option */}
                <Link to="/profile" onClick={() => setShowDropdown(false)}>
                  Update Profile
                </Link>

                {/* Logout option */}
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

      {/* Logout Confirmation Popup  */}
      {showPopup && (
        <div>
          <div>
            <p>Are you sure you want to logout?</p>
            <div>
              <button onClick={() => setShowPopup(false)}>No</button>
              <button onClick={handleLogout}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
