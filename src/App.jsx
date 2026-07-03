import { Navigate, Route, Routes } from "react-router";
import React,{useEffect} from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import HomePage from "./pages/HomePage"
import LogInPage from './pages/LogInPage'
import SignUpPage from './pages/SignUpPage'

import { useAuthStore } from './store/useAuthStore'


import HomePage from "./pages/HomePage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage /> } />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}
export default App;