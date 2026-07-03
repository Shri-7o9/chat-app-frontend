import React,{useEffect} from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import HomePage from "./pages/HomePage"
import LogInPage from './pages/LogInPage'
import SignUpPage from './pages/SignUpPage'

import { useAuthStore } from './store/useAuthStore'


const App = () => {
  const {checkAuth,isCheckingAuth,authUser}=useAuthStore()

  useEffect(()=>{checkAuth()},[checkAuth])

  if(isCheckingAuth && !authUser){
    return <div>Loading...</div>
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={authUser?<HomePage/>:<Navigate to="/login"/>}/>
        <Route path="/login" element={!authUser?<LogInPage/>:<Navigate to="/"/>}/>
        {/*<Route path="/signup" element={!authUser?<SignUp/>:<Navigate to="/"/>}/>*/}
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
