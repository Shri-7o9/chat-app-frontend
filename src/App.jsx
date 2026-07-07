import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { checkAuth } from "./store/authSlice";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import UpdateProfilePage from "./pages/updateProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

const App = () => {
  const dispatch = useDispatch();
  const { isCheckingAuth, authUser } = useSelector((state) => state.auth);

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
        {/* default route  */}
        <Route
          path="/"
          element={
            authUser ? <Navigate to="/chat" /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UpdateProfilePage />
            </ProtectedRoute>
          }
        />
        {/* chat page route */}
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
