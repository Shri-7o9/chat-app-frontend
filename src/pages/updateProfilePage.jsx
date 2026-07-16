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
      <div data-theme="corporate" className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card h-200 w-600 max-w-lg bg-base-100 border-base-300 border-rounded shadow-md ">
          <div className="card-body px-8 py-45">
            <h1 className="text-4xl text-center text-primary">Update Profile </h1>

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
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
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
