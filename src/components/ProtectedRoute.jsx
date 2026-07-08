import { Navigate } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { authUser } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  if (!authUser && !token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
