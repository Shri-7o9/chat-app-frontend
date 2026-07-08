import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import UpdateProfilePage from "./pages/updateProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

const App = () => {
  const { authUser } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Toaster />
      <Navbar />
      <Routes>
        {/* default redirect */}
        <Route
          path="/"
          element={
            authUser ? <Navigate to="/chat" /> : <Navigate to="/login" />
          }
        />

        {/* auth pages */}
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/signup" element={<div>Signup Page</div>} />

        {/* verify email page */}
        <Route
          path="/verify-email/:token"
          element={<div>Verify Email Page</div>}
        />

        {/* reset password page*/}
        <Route
          path="/reset-password/:token"
          element={<div>Reset Password Page</div>}
        />

        {/* protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UpdateProfilePage />
            </ProtectedRoute>
          }
        />

        {/* chat page */}
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
