import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, Search, Inbox } from "lucide-react";
import { setSelectedUser, getMessageRequests } from "../../stores/chatSlice.js";
import UserListItem from "./UserListItem.jsx";
import NewChatModel from "./NewChatModel.jsx";
import MessageRequestsModal from "./MessageRequestsModal.jsx";

export default function Sidebar({ users, currentUser, selectedUser }) {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.auth.onlineUsers) || [];
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  return (
    <aside
      data-theme="corporate"
      className="w-72 h-screen bg-base-100 border-r border-base-300 flex flex-col"
    >
      <div className="p-4">
        <h2 className="text-3xl font-normal text-center mb-4">Chats</h2>

        <div style={{ display: "flex", alignItems: "center" }}>
          <label className="flex items-center w-full h-10 px-2 bg-white border-2 border-gray-400 rounded-full shadow-sm">
            <input
              type="text"
              placeholder="Search users..."
              className="flex-1 bg-transparent outline-none placeholder:text-gray-500"
            />
            <Search size={18} className="text-gray-500" />
          </label>

          {/* Message Requests button */}
          <button
            onClick={() => {
              dispatch(getMessageRequests());
              document.getElementById("message_requests_modal").showModal();
            }}
            title="Message Requests"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px",
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <Inbox size={26} />
          </button>

          {/* New chat button */}
          <button
            onClick={() => setShowNewChatModal(true)}
            title="Start new chat"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px",
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <UserPlus size={30} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => dispatch(setSelectedUser(user))}
            className={`group w-full rounded-xl border transition-all duration-200 ${
              selectedUser?._id === user._id
                ? "bg-gray-500 border-gray-500 hover:!bg-gray-700"
                : "bg-base-100 border-base-200 hover:bg-base-300"
            }`}
          >
            <div
              className={`p-4 text-left transition-colors duration-200 ${
                selectedUser?._id === user._id
                  ? "text-white group-hover:text-white"
                  : "text-black"
              }`}
            >
              <UserListItem
                user={user}
                isOnline={onlineUsers.includes(user._id)}
              />
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-base-300 p-4 text-center font-medium">
        {currentUser?.firstName} {currentUser?.lastName}
      </div>

      {showNewChatModal && (
        <NewChatModel onClose={() => setShowNewChatModal(false)} />
      )}

      {/* Message Requests Modal */}
      <MessageRequestsModal />
    </aside>
  );
}
