import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router"
import { Eye, EyeOff } from "lucide-react"
import { resetPassword } from "../stores/authSlice"

const ResetPasswordPage = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword.length < 6) {
            return toast.error("Password must be atleast 6 characters")
        }
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match")
        }
        try {
            await dispatch(resetPassword({ token, newPassword })).unwrap()
            toast.success("Password reset successful")
            navigate("/login")
        } catch (error) {
            toast.error(error || "Reset link is invalid or expired")
        }
    }

    return (
        <div className="min-h-screen bg-white" data-theme="corporate">
            {/* Main */}
            <div className="flex justify-center items-center py-24 px-4">
                <div className="bg-blue-50 rounded-lg w-137.5 p-8">
                    {/* Heading */}
                    <h1 className="text-4xl font-semibold text-center mb-8">
                        Change Your Password
                    </h1>

                    {/* Card */}
                    <div className="card bg-base-100 shadow-sm max-w-2xl mx-auto w-100">
                        <div className="card-body px-10 py-7">
                            <p className="text-center text-gray-500 text-xl leading-relaxed mb-10">
                                Enter your new password for your account
                            </p>

                            <form onSubmit={handleSubmit}>
                                {/* New Password */}
                                <div className="form-control mb-6">
                                    <label className="label">
                                        <span className="label-text text-base font-medium">
                                            Enter New Password
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter Your New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="input rounded-full input-bordered w-full pr-12"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword ? (
                                                <Eye size={20} />
                                            ) : (
                                                <EyeOff size={20} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="form-control mb-8">
                                    <label className="label">
                                        <span className="label-text text-base font-medium">
                                            Confirm Password
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Enter Your Password Again"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="input rounded-full input-bordered w-full pr-12"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {showConfirmPassword ? (
                                                <Eye size={20} />
                                            ) : (
                                                <EyeOff size={20} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Button */}
                                <button
                                    type="submit"
                                    className="btn rounded-full btn-primary w-full hover:scale-110 transition-all duration-300"
                                >
                                    Change My Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordPage