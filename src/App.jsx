import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { checkAuth } from "./store/authSlice";
import UpdateProfilePage from "./pages/updateProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

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
    <BrowserRouter>
      <Toaster />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            authUser ? <Navigate to="/chat" /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/signup" element={<div>Signup Page</div>} />
        <Route
          path="/verify-email/:token"
          element={<div>Verify Email Page</div>}
        />
        <Route
          path="/reset-password/:token"
          element={<div>Reset Password Page</div>}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UpdateProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <div>Chat Page Coming Soon</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
