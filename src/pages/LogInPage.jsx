import { useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { forgetPassword, login } from "../stores/authSlice";


const LogInPage = () => {
  const [showPassword, setShowPassword]= useState(false)
  const [showForgetPassword, setShowForgetPassword]=useState(false)
  const [resetEmail,setResetEmail]=useState("")
  const [formData,setFormData]= useState({
    email:"",
    password:"",
  })
  
  const dispatch=useDispatch()
  const {isLoggingIn,isSendingResetLink}=useSelector((state)=>state.auth)

  const handleSubmit=async(e)=>{
    e.preventDefault()

     if(!formData.email||!formData.password){
      return toast.error("All fields are required")
     }

     if(formData.password.length<6){
      return toast.error("Password must be at least 6 characters")
     }

    dispatch(login(formData))
  }
  const handleForgetPassword=(e)=>{
    e.preventDefault()
    if(!resetEmail){
      return toast.error("please enter your email")
    }
    dispatch(forgetPassword(resetEmail))
    setResetEmail("")
  }

  if(showForgetPassword){
    return(
      <div>
        <h1>Reset Password</h1>
        <form onSubmit={handleForgetPassword}>
          <label>Email</label>
          <input 
          type="email"
          placeholder="Enter your email"
          value={resetEmail}
          onChange={(e)=>setResetEmail(e.target.value)}
          />
          <button type="submit" disabled={isSendingResetLink}>
            {isSendingResetLink?"Sending...":"Send Reset Link"}
          </button>
          <button type="button" onClick={()=>setShowForgetPassword(false)}>
            Back to Login
          </button>
        </form>
      </div>
    )
  }
  
  return (
    <>
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e)=>setFormData({...formData,email:e.target.value})}
        />
        <label>Password</label>
        <input
        type={showPassword?"text":"password"}
        placeholder="Password"
        value={formData.password}
        onChange={(e)=>setFormData({...formData,password:e.target.value})}
        />
        <button type="button" onClick={()=>setShowPassword(!showPassword)}>
          {showPassword?"Hide":"Show"}
        </button>
        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn?"Logging in...":"Login"}
        </button>
        <button type="button" onClick={()=>setShowForgetPassword(true)}>
          Forget Password?
        </button>

      </form>

    </div>
    
    <div>
      Create an account?
      <Link to="/signup">Create</Link>
    </div>

    </>
  )
}

export default LogInPage
