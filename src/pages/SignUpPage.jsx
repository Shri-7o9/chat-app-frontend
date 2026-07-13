import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "../store/authSlice.js";

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSigningUp = useSelector((state) => state.auth.isSigningUp);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "Full name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "User name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      await dispatch(signup(formData)).unwrap();
      navigate("/");
    } catch (error) {
      setServerError(error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200" data-theme="corporate">
      <div className="flex justify-center py-15 px-100">
        <div className="card card-body p-5 bg-white shadow-xl rounded-2xl ">
           
          <div className="card-body p-10">

            <h2 className="text-4xl font-bold text-center text-black">
              Get started with
              <br />
              <span>
                Chat<span className="text-blue-600">App</span>
              </span>
            </h2>

            <form onSubmit={handleSubmit}>
           
<div className="mt-8">
  <label className="label">
    <span className="label-text font-semibold text-primary w-100">
      Full Name
    </span>
  </label>

  <input
    type="text"
    name="firstName"
    value={formData.firstName}
    onChange={handleChange}
    placeholder="Enter your full name"
    className="input input-bordered bg-gray-100 text-black placeholder:text-gray-500 border-gray-300 rounded-full w-full"
  />

  {formErrors.firstName && (
    <p className="text-red-500 text-sm mt-1">
      {formErrors.firstName}
    </p>
  )}
</div>

<div className="mt-4">
  <label className="label">
    <span className="label-text font-semibold text-primary">
      User Name
    </span>
  </label>

  <input
    type="text"
    name="lastName"
    value={formData.lastName}
    onChange={handleChange}
    placeholder="Enter your user name"
    className="input input-bordered bg-gray-100 text-black placeholder:text-gray-500 border-gray-300 rounded-full w-full"
  />

  {formErrors.lastName && (
    <p className="text-red-500 text-sm mt-1">
      {formErrors.lastName}
    </p>
  )}
</div>

<div className="mt-4">
  <label className="label">
    <span className="label-text font-semibold text-primary">
      Email
    </span>
  </label>

  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="Enter your email"
    className="input input-bordered bg-gray-100 text-black placeholder:text-gray-500 border-gray-300 rounded-full w-full"
  />

  {formErrors.email && (
    <p className="text-red-500 text-sm mt-1">
      {formErrors.email}
    </p>
  )}
</div>

<div className="mt-4">
  <label className="label">
    <span className="label-text font-semibold text-primary">
      Password
    </span>
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Enter your password"
      className="input input-bordered bg-gray-100 text-black placeholder:text-gray-500 border-gray-300 rounded-full w-full pr-12"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
    >
      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
    </button>
  </div>

  {formErrors.password && (
    <p className="text-red-500 text-sm mt-1">
      {formErrors.password}
    </p>
  )}
</div>

<div className="mt-4">
  <label className="label">
    <span className="label-text font-semibold text-primary">
      Confirm Password
    </span>
  </label>

  <div className="relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      placeholder="Confirm your password"
      className="input input-bordered bg-gray-100 text-black placeholder:text-gray-500 border-gray-300 rounded-full w-full pr-12"
    />

    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
    >
      {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
    </button>
  </div>

  {formErrors.confirmPassword && (
    <p className="text-red-500 text-sm mt-1">
      {formErrors.confirmPassword}
    </p>
  )}
</div>
            {serverError && (
              <p className="text-red-500 text-center mt-4">
                {serverError}
              </p>
            )}

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSigningUp}
                className="btn btn-secondary w-full rounded-full hover:scale-105 transition"
              >
                {isSigningUp ? "Signing up..." : "Sign Up"}
              </button>
            </div>

            <p className="text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>

          </form>

        </div>
      </div>
    </div>
  </div>
);
};

export default SignUpPage;