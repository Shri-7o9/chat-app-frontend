import React, { useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { login, forgetPassword } from "../stores/authSlice";
import { Eye, EyeOff } from "lucide-react";

const HomePage = () => {
  const dispatch = useDispatch();

  const { isLoggingIn, isSendingResetLink } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  const [resetEmail, setResetEmail] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.error("All fields are required");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    dispatch(login(formData));
  };

  const handleForgetPassword = (e) => {
    e.preventDefault();

    if (!resetEmail) {
      return toast.error("Please enter your email");
    }

    dispatch(forgetPassword(resetEmail));
    setResetEmail("");
  };

  return (
    <div className="min-h-screen bg-base-200" data-theme="corporate">
      {/* Main */}
      <div className="hero min-h-[90vh]">
        <div
          className={`hero-content w-full max-w-7xl ${
            showForgetPassword ? "justify-center" : "justify-between"
          }`}
        >
          {/* Left Side */}
          {!showForgetPassword && (
            <div className="w-1/2 flex justify-center">
              <img
                src="/img/chat-bubble-3d-business-icon-png.webp"
                alt="logo"
                className="w-80"
              />
            </div>
          )}

          {/* Right Side */}
          <div
            className={`${
              showForgetPassword ? "w-full max-w-3xl" : "w-112.5"
            } bg-base-100 p-10 rounded-lg shadow-lg`}
          >
            {!showForgetPassword ? (
              <>
                <h2 className="text-4xl font-bold text-center text-black">
                  Welcome to
                  <br />
                  <span>
                    Chat<span className="text-blue-600">App</span>
                  </span>
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Email */}
                  <div>
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>

                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      className="input input-bordered w-full rounded-full"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                   {/* Password */}
                   <div>
                     <label className="label">
                       <span className="label-text">Password</span>
                     </label>
                   
                     <div className="relative">
                       <input
                         type={showPassword ? "text" : "password"}
                         placeholder="Enter Your Password"
                         className="input input-bordered w-full rounded-full pr-14"
                         value={formData.password}
                         onChange={(e) =>
                           setFormData({
                             ...formData,
                             password: e.target.value,
                           })
                         }
                       />
                   
                       <button
                         type="button"
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                       >
                         {showPassword ? (
                           <EyeOff className="w-5 h-5" />
                         ) : (
                           <Eye className="w-5 h-5" />
                         )}
                       </button>
                     </div>
                   </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn rounded-full btn-primary w-full hover:scale-110 transition-all duration-300"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? "Logging in..." : "Login"}
                  </button>

                  {/* Forgot Password */}
                  <div className="text-left">
                    <button
                      type="button"
                      className="link link-hover text-sm"
                      onClick={() => setShowForgetPassword(true)}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="divider">OR</div>

                  <Link
                    to="/signup"
                    className="btn rounded-full btn-secondary w-full hover:scale-110 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </form>
              </>
            ) : (
              <>
                {/* Reset Password */}
                <div className="bg-blue-50 rounded-lg w-137.5 p-8 max-w-2xl mx-auto">
                  <h1 className="text-5xl font-semibold text-center mb-8">
                    Forgot Password
                  </h1>

                  <div className="bg-white rounded-lg shadow-sm p-10">
                    <p className="text-center text-gray-500 text-xl leading-relaxed mb-10">
                      Enter the username or email for your account
                      <br />
                      so we can send you a link to reset your
                      <br />
                      password.
                    </p>

                    <form
                      className="space-y-6"
                      onSubmit={handleForgetPassword}
                    >
                      <div>
                        <label className="label">
                          <span className="label-text text-lg">
                            Email or Username
                          </span>
                        </label>

                        <input
                          type="email"
                          placeholder="example@gmail.com"
                          className="input input-bordered rounded-full w-full h-14 text-lg"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary rounded-full w-full py-6 hover:scale-110 transition-all duration-300"
                        disabled={isSendingResetLink}
                      >
                        {isSendingResetLink
                          ? "Sending..."
                          : "Send Reset Link"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary rounded-full w-full py-6 hover:scale-110 transition-all duration-300"
                        onClick={() => setShowForgetPassword(false)}
                      >
                        Back to Login
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;