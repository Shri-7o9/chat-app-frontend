import React,{useEffect} from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import HomePage from "./pages/HomePage"
import LogInPage from './pages/LogInPage'
import SignUpPage from './pages/SignUpPage'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './stores/authSlice'


const App=()=> {
  const dispatch=useDispatch()
  const {isCheckingAuth,authUser}=useSelector((state)=>state.auth)

  useEffect(()=>{dispatch(checkAuth())},[dispatch])

  if(isCheckingAuth){
    return <div>Loading...</div>
  }
  
  return (
    <div>
      <Routes>
        <Route path="/" element={authUser?<HomePage />:<Navigate to="/login" />} />
        <Route path="/login" element={!authUser?<LogInPage />:<Navigate to="/" />} />
        {/*<Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/" />} />*/}
      </Routes>

      <Toaster />
    </div>
  );
}
export default App;