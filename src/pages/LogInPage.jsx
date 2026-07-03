import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import toast from "react-hot-toast"


const LogInPage = () => {
  const [showPassword, setShowPassword]= useState(false)
  const [formData,setFormData]= useState({
    email:"",
    password:"",
  })
  const {login, isLoggingIn}=useAuthStore()
  const handleSubmit=async(e)=>{
    e.preventDefault()
     if(!formData.email||!formData.password){
      return toast.error("All fields are required")
     }

     if(formData.password.length<6){
      return toast.error("Password must be at least 6 characters")
     }
    login(formData)
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
