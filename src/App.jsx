import {  Routes, Route, Navigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { checkAuth } from "./stores/authSlice";

import HomePage from "./pages/HomePage"
import LogInPage from './pages/LogInPage'
import SignUpPage from './pages/SignUpPage'
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UpdateProfilePage from "./pages/updateProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

 return (
    <div>
      <Routes>
        <Route path="/" element={authUser?<HomePage />:<Navigate to="/login" />} />
        <Route path="/login" element={!authUser?<LogInPage />:<Navigate to="/" />} />
        <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/" />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage/>}/>
        <Route path="/reset-password" element={<ResetPasswordPage/>}/>
      </Routes>

      <Toaster/>
    </div>
  );
};

export default App;
