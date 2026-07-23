import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, Search, Inbox, ArrowLeft } from "lucide-react";
import { setSelectedUser, getMessageRequests } from "../../stores/chatSlice.js";
import UserListItem from "./UserListItem.jsx";
import NewChatModel from "./NewChatModel.jsx";

export default function Sidebar({
  users,
  currentUser,
  selectedUser,
  isRequestView,
  onOpenRequests,
  onCloseRequests,
}) {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.auth.onlineUsers) || [];
  const { messageRequests, isRequestsLoading } = useSelector(
    (state) => state.chat,
  );
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const handleOpenRequests = () => {
    dispatch(getMessageRequests());
    onOpenRequests();
  };

  const handleSelectRequestUser = (user) => {
    dispatch(setSelectedUser(user));
  };

  return (
    <aside
      data-theme="corporate"
      className="w-72 h-screen bg-base-100 border-r border-base-300 flex flex-col"
    >
      <div className="p-4">
        {/* Header — switches between Chats and Requests */}
        <div className="flex items-center mb-4">
          {isRequestView && (
            <button
              onClick={onCloseRequests}
              className="mr-2 p-1 rounded-full hover:bg-base-200"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-3xl font-normal flex-1 text-center">
            {isRequestView ? "Requests" : "Chats"}
          </h2>
        </div>

        {/* Search + buttons — only show on Chats view */}
        {!isRequestView && (
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
              onClick={handleOpenRequests}
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
        )}
      </div>

      {/* User list — switches between connections and requests */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        {isRequestView ? (
          isRequestsLoading ? (
            <p className="text-center text-gray-400 mt-4">Loading...</p>
          ) : messageRequests.length === 0 ? (
            <p className="text-center text-gray-400 mt-4">
              No message requests
            </p>
          ) : (
            messageRequests.map((user) => (
              <button
                key={user._id}
                onClick={() => handleSelectRequestUser(user)}
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
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profilePic || "/avatar-placeholder.png"}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs opacity-60 truncate">
                        {user.lastMessage || "Sent you a message"}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )
        ) : (
          users.map((user) => (
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
          ))
        )}
      </div>

      <div className="border-t border-base-300 p-4 text-center font-medium">
        {currentUser?.firstName} {currentUser?.lastName}
      </div>

      {showNewChatModal && (
        <NewChatModel onClose={() => setShowNewChatModal(false)} />
      )}
    </aside>
  );
}
