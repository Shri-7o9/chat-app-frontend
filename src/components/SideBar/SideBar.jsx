import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, Inbox, ArrowLeft } from "lucide-react";
import { setSelectedUser, getMessageRequests } from "../../stores/chatSlice.js";
import UserListItem from "./UserListItem.jsx";
import NewChatModel from "./NewChatModel.jsx";

export default function Sidebar({
  users = [],
  currentUser,
  selectedUser,
  isRequestView,
  onOpenRequests,
  onCloseRequests,
}) {
  const dispatch = useDispatch();

  const onlineUsers =
    useSelector((state) => state.auth.onlineUsers) || [];

  const { messageRequests, isRequestsLoading } = useSelector(
    (state) => state.chat
  );

  const [showNewChatModel, setShowNewChatModel] = useState(false);
  const [query, setQuery] = useState("");

  const handleOpenRequests = () => {
    dispatch(getMessageRequests());
    onOpenRequests?.();
  };

  const handleSelectRequestUser = (user) => {
    dispatch(setSelectedUser(user));
  };

  const handleModalClose = () => {
    setShowNewChatModel(false);
  };

  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside
      data-theme="corporate"
      className="w-[300px] min-w-[300px] flex-shrink-0 h-full bg-base-200 border-r border-base-300 flex flex-col"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center mb-4">
          {isRequestView && (
            <button
              onClick={onCloseRequests}
              className="mr-2 p-1 rounded-full hover:bg-base-300"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <h2 className="text-3xl font-normal flex-1 text-center">
            {isRequestView ? "Requests" : "Chats"}
          </h2>
        </div>

        {/* Search + Actions */}
        {!isRequestView && (
          <div className="flex items-center gap-2 w-full">
            <label className="flex flex-1 min-w-0 items-center h-10 px-3 bg-white border-2 border-gray-400 rounded-full shadow-sm">
              <input
                type="text"
                placeholder="Search active chats"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-black outline-none"
              />
              <Search size={18} className="text-gray-500" />
            </label>

            <button
              onClick={handleOpenRequests}
              title="Message Requests"
              className="flex items-center justify-center p-2 rounded-full hover:bg-base-300 transition"
            >
              <Inbox size={26} />
            </button>

            <button
              onClick={() => setShowNewChatModel(true)}
              title="Add new user"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-110 transition-all duration-300 flex-shrink-0"
            >
              <Plus size={20} />
            </button>
          </div>
        )}
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        {isRequestView ? (
          isRequestsLoading ? (
            <p className="text-center text-gray-400 mt-4">
              Loading...
            </p>
          ) : messageRequests?.length === 0 ? (
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
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        user.profilePic ||
                        "/avatar-placeholder.png"
                      }
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full"
                    />

                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {user.fullName}
                      </p>

                      <p className="text-xs opacity-60 truncate">
                        {user.lastMessage ||
                          "Sent you a message"}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )
        ) : (
          filteredUsers.map((user) => (
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
                    ? "text-white"
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

      {/* Modal */}
      {showNewChatModel && (
        <NewChatModel onClose={handleModalClose} />
      )}
    </aside>
  );
}