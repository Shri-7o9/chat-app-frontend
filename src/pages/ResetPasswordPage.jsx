import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import{resetPassword} from "../stores/authSlice"

const ResetPasswordPage=()=>{
    const {token}=useParams()
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const [newPassword,setNewPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")

    const handleSubmit = async (e)=>{
        e.preventDefault()
        if(newPassword.length<6){
            return toast.error("Password must be atleast 6 characters")
        }
        if(newPassword!==confirmPassword){
            return toast.error("Passwords do not match")
        }
        try{
            await dispatch(resetPassword({token,newPassword})).unwrap()
            toast.success("Password reset successful")
            navigate("/login")
        }catch(error){
            toast.error(error||"Reset link is invalid or expired")
        }

    }

    return(
        <form onSubmit={handleSubmit}>
            <label>New Password</label>
            <input
            type="Password"
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
            />

            <label>Confirm Password</label>
            <input
            type="password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            />
            <button type="submit">Reset Password</button>
        </form>
    )
}
export default ResetPasswordPage