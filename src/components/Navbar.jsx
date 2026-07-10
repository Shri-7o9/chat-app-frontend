import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { logoutUser } from "../store/authSlice";
import { User } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser, isLoggingIn } = useSelector((state) => state.auth);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // close the modal after logout
      document.getElementById("logout_modal").close();
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
                {/* Update Profile */}
                <Link to="/profile" onClick={() => setShowDropdown(false)}>
                  Update Profile
                </Link>

                {/* Logout — opens DaisyUI modal */}
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

      {/* DaisyUI Logout Confirmation Modal */}
      <dialog id="logout_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Logout</h3>
          <p className="py-4">Are you sure you want to logout?</p>
          <div className="modal-action">
            {/* No button — closes modal, stays on page */}
            <form method="dialog">
              <button className="btn">No</button>
            </form>

            {/* Yes button — dispatches logout */}
            <button
              className="btn btn-error"
              onClick={handleLogout}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging out..." : "Yes"}
            </button>
          </div>
        </div>

        {/* clicking outside the modal closes it */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Navbar;
