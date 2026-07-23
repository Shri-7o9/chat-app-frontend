import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, resetPasswordState } from "../stores/authSlice";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, errorMessage } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    dispatch(resetPasswordState()); 

    // Client-side validations
    if (newPassword !== confirmPassword) {
      setLocalError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setLocalError("New password must be at least 6 characters");
      return;
    }

    // 1. Dispatch the action and unwrap the promise result
    const resultAction = await dispatch(changePassword({ currentPassword, newPassword }));
    
    // 2. Clear inputs directly inside the event handler if successful
    if (changePassword.fulfilled.match(resultAction)) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Optional: Auto-clear backend success banner after 4 seconds
      setTimeout(() => {
        dispatch(resetPasswordState());
      }, 4000);
    }
  };

  const activeError = localError || (isError ? errorMessage : "");

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-lg" data-theme="corporate">
        <div className="card-body">
          <h2 className="card-title mb-2">Change Password</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Current Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {activeError && <p className="text-error text-sm">{activeError}</p>}
            {isSuccess && <p className="text-success text-sm">Password changed successfully</p>}

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
