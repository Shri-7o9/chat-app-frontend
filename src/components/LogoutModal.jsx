import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../store/authSlice";

const LogoutModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggingIn } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      document.getElementById("logout_modal").close();
      navigate("/login");
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  return (
    <dialog id="logout_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Logout</h3>
        <p className="py-4">Are you sure you want to logout?</p>

        <div className="modal-action">
          {/* No button — closes modal, stays on page */}
          <form method="dialog">
            <button className="btn">No</button>
          </form>

          {/* Yes button — dispatches logout */}
          <button
            className="btn btn-error"
            onClick={handleLogout}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging out..." : "Yes"}
          </button>
        </div>
      </div>

      {/* clicking outside modal closes it */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default LogoutModal;
