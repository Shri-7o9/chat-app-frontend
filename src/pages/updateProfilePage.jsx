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
    firstName: "",
    lastName: "",
  });

  useEffect(()=>{
    if(authUser){
      setFormData({
        firstName:authUser.firstName||"",
        lastName:authUser.lastName||"",
      })
    }
  },[authUser])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedFirstName=formData.firstName.trim()
    const trimmedLastName=formData.lastName.trim()

    if(!trimmedFirstName||!trimmedLastName){
      return toast.error("First and last name cannot be empty")
    }

    try {
      await dispatch(updateProfile({firstName:trimmedFirstName, lastName:trimmedLastName})).unwrap();
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
          <label>First Name</label>
          <input
            type="text"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            type="text"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
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
