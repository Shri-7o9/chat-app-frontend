import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { setSelectedUser } from "../../stores/chatSlice.js";
import { axiosInstance } from "../../libs/axios.js";
import UserListItem from "./UserListItem.jsx";
import NewChatModal from "./NewChatModel.jsx";

export default function Sidebar({ currentUser, selectedUser }) {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.auth.onlineUsers) || [];
  
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [query, setQuery] = useState("");

  // Wrapped in useCallback so it's a stable dependency we can pass down safely
  const fetchConnections = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/auth/sidebar");
      setConnections(res.data);
    } catch (error) {
      console.error("Error fetching sidebar connections:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      try {
        const res = await axiosInstance.get("/auth/sidebar");
        if (isMounted) setConnections(res.data);
      } catch (error) {
        console.error("Error on mount fetch:", error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initFetch();
    return () => { isMounted = false; };
  }, []);

  const filteredUsers = connections.filter((u) =>
    `${u.fullName}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <aside>
      <div>
        <h2>Chats</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="text"
            placeholder="Search active chats..."
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
        {loading && <p style={{ padding: "10px", fontSize: "14px", color: "#aaa" }}>Loading chats...</p>}
        
        {!loading && connections.length === 0 && (
          <p style={{ padding: "10px", fontSize: "14px", color: "#aaa" }}>
            No active conversations. Click "+" to add someone!
          </p>
        )}

        {!loading && filteredUsers.map((user) => (
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
        <NewChatModal 
          onClose={() => setShowNewChatModal(false)} 
          onUserAdded={fetchConnections} // <-- FIX: Passing the refresh function here
        />
      )}
    </aside>
  );
}
