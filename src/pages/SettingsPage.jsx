import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router";
import { logoutUser } from "../store/authSlice";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  return (
    <div>
      <h1>Settings</h1>

      <div>
        <h2>Profile</h2>
        <Link to="/profile">Update Profile</Link>
      </div>

      <div>
        <h2>Account</h2>
        <button onClick={() => setShowPopup(true)}>Logout</button>
      </div>

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
    </div>
  );
};

export default SettingsPage;
