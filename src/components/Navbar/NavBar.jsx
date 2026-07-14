import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { MessageSquare, LogOut } from "lucide-react";
import { logoutUser } from "../../stores/authSlice.js";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.authUser);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-indigo-600" />
        <span className="font-semibold text-gray-900">ChatApp</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{authUser?.fullName}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}