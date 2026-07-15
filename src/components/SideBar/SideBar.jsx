import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { setSelectedUser } from "../../stores/chatSlice.js";
import UserListItem from "./UserListItem.jsx";
import NewChatModal from "./NewChatModel.jsx";

export default function Sidebar({ users, currentUser, selectedUser }) {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.auth.onlineUsers) || [];
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [query, setQuery] = useState("");

  // filters your EXISTING contacts only
  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <aside>
      <div>
        <h2>Chats</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => setShowNewChatModal(true)}
            title="Add new user"
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
        {filteredUsers.map((user) => (
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
        <NewChatModal onClose={() => setShowNewChatModal(false)} />
      )}
    </aside>
  );
}