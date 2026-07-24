import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { updateProfile } from "../stores/authSlice";
import toast from "react-hot-toast"

const UpdateProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isUpdatingProfile, authUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState(() => ({
    fullName: authUser?.fullName || "",
    userName: authUser?.userName || "",
  }));

  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image file");
    }

    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return toast.error(`Image must be smaller than ${MAX_SIZE_MB}MB`);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImg(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedFullName = formData.fullName.trim();
    const trimmedUsername = formData.userName.trim();

    if (!trimmedFullName || !trimmedUsername) {
      return toast.error("Full name and userName cannot be empty");
    }

    try {
      await dispatch(
        updateProfile({
          fullName: trimmedFullName,
          userName: trimmedUsername,
          // Only send profilePic if the user actually picked a new one
          ...(selectedImg && { profilePic: selectedImg }),
        }),
      ).unwrap();
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

      <div className="flex flex-col items-center mt-4">
        <div className="relative">
          <img
            src={selectedImg || authUser?.profilePic || "/avatar-placeholder.png"}
            alt="Profile"
            className="size-32 rounded-full object-cover border-4 border-base-300"
          />
          <label
            htmlFor="avatar-upload"
            className={`absolute bottom-0 right-0 bg-primary hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
              isUpdatingProfile ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 text-primary-content">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.174C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.174 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUpdatingProfile}
            />
          </label>
        </div>
        <p className="text-sm text-base-content/60 mt-2">
          {isUpdatingProfile ? "Uploading..." : "Click the icon to change your photo"}
        </p>
      </div>

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
