import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { updateProfile } from "../stores/authSlice";
import toast from "react-hot-toast"

const UpdateProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isUpdatingProfile, authUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
  });

  useEffect(()=>{
    if(authUser){
      setFormData({
        fullName:authUser.fullName||"",
        username:authUser.username||"",
      })
    }
  },[authUser])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedFullName=formData.fullName.trim()
    const trimmedUsername=formData.username.trim()

    if(!trimmedFullName||!trimmedUsername){
      return toast.error("Full name and username cannot be empty")
    }

    try {
      await dispatch(updateProfile({fullName:trimmedFullName, username:trimmedUsername})).unwrap();
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
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
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
