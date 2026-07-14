import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { setSelectedUser } from "../../stores/chatSlice.js";
import UserListItem from "./UserListItem.jsx";
import NewChatModel from "./NewChatModel.jsx";

export default function Sidebar({ users, currentUser, selectedUser }) {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.auth.onlineUsers) || [];
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  return (
    <aside>
      <div>
        <h2>Chats</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input type="text" placeholder="Search users..." />
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
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div>
        {users.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            isActive={selectedUser?._id === user._id}
            isOnline={onlineUsers.includes(user._id)}
            onClick={() => dispatch(setSelectedUser(user))}
          />
        ))}
      </div>

      <div>
        <span>{currentUser?.firstName} {currentUser?.lastName}</span>
      </div>

      {showNewChatModal && (
        <NewChatModel onClose={() => setShowNewChatModal(false)} />
      )}
    </aside>
  );
}