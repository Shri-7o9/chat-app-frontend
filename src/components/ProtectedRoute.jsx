import { Navigate } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
