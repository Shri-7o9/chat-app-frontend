import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MoreVertical } from "lucide-react";
import { setSelectedUser, getUsers } from "../../stores/chatSlice";
import { axiosInstance } from "../../libs/axios.js";

export default function ChatHeader({ user, isOnline }) {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.chat);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteConversation = () => {
    setShowDropdown(false);
    document.getElementById("delete_conversation_modal").showModal();
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);

      // use existing disconnect API
      await axiosInstance.delete("/auth/disconnect", {
        data: { targetUserId: user._id },
      });

      // close chat window
      dispatch(setSelectedUser(null));

      // refresh sidebar to remove user instantly
      dispatch(getUsers());

      document.getElementById("delete_conversation_modal").close();
    } catch (error) {
      console.error("Error removing connection:", error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  const displayName =
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Unknown User";

  return (
    <>
      <div
        className="border-b bg-gray-100 px-6 py-4 flex items-center justify-between"
        data-theme="corporate"
      >
        <div className="flex items-center gap-3">
          <img
            src={user.profilePic || "/avatar-placeholder.png"}
            alt={displayName}
            className="w-11 h-11 rounded-full object-cover"
          />
          <p className="text-3xl font-semibold">{displayName}</p>
        </div>

        {/* Three dots button */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 rounded-full hover:bg-base-200 transition-colors"
          >
            <MoreVertical size={20} />
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-10 bg-base-100 border border-base-300 rounded-xl shadow-lg z-50 min-w-48">
              <button
                onClick={handleDeleteConversation}
                className="w-full text-left px-4 py-3 text-sm text-error hover:bg-base-200 rounded-xl transition-colors"
              >
                Delete Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Conversation Modal */}
      <dialog id="delete_conversation_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Conversation</h3>
          <p className="py-4 text-gray-500">
            Are you sure you want to delete this conversation? This will remove
            this user from your view.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" disabled={isDeleting}>
                No
              </button>
            </form>
            <button
              className="btn btn-error"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
