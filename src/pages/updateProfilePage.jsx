import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { updateProfile } from "../store/authSlice";

const UpdateProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isUpdatingProfile } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      navigate("/");
    } catch (error) {
      console.log("Update failed", error);
    }
  };

  return (
    <div>
      <h1>Update Profile</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={formData.userName}
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
          />
        </div>

        <button type="submit" disabled={isUpdatingProfile}>
          {isUpdatingProfile ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <button onClick={() => navigate("/")}>Back</button>
    </div>
  );
};

export default UpdateProfilePage;
