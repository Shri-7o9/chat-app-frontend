import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { updateProfile } from "../stores/authSlice";
import toast from "react-hot-toast"

const UpdateProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isUpdatingProfile, authUser } = useSelector((state) => state.auth);

  // Initialize state directly from authUser to prevent render loops
  const [formData, setFormData] = useState(() => ({
    fullName: authUser?.fullName || "",
    userName: authUser?.userName || "",
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedFullName = formData.fullName.trim();
    const trimmedUsername = formData.userName.trim();

    if (!trimmedFullName || !trimmedUsername) {
      return toast.error("Full name and userName cannot be empty");
    }

    try {
      await dispatch(updateProfile({ fullName: trimmedFullName, userName: trimmedUsername })).unwrap();
      navigate("/");
    } catch (error) {
      console.log("Update failed", error);
    }
  };


  return (
    
    <div>
      <div data-theme="corporate" className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card h-200 w-600 max-w-lg bg-base-100 border-base-300 border-rounded shadow-md ">
  <div className="card-body px-8 py-45">
      <h1 className="text-4xl text-center text-primary">Update Profile </h1>

      <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
        <div className="form-control">
          <label className="label" >
                <span className="label-text font-semibold">
                  Full Name
                </span>
              </label>
           <input
                type="text"
                placeholder="Enter your full name"
                className="input rounded-full  w-full"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value,
                  })
                }
          />
        </div>

        <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  User Name
                </span>
              </label>
          <input
                type="text"
                placeholder="Enter your user name"
                className="input rounded-full w-full"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    userName: e.target.value,
                  })
                }
          />
        </div>
<div className="flex justify-center mt-7">
  <button
    type="submit"
    className="btn rounded-full bg-transparent border-primary text-primary hover:scale-110 transition-all duration-300"
    disabled={isUpdatingProfile}
  >
    {isUpdatingProfile ? "Saving..." : "Save Changes"}
  </button>
</div>
      </form>

<div className="flex justify-center mt-3">
 <button
  type="button"
  onClick={() => navigate("/")}
  className="btn rounded-full bg-transparent border-primary text-primary  hover:scale-110 transition-all duration-300"
>
  Back
</button>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default UpdateProfilePage;
