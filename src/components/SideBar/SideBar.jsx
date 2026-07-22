import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, Search, Inbox } from "lucide-react";
import { Plus, Trash2 } from "lucide-react"; // Added Trash2 icon for a cleaner UI look
import { setSelectedUser, getMessageRequests } from "../../stores/chatSlice.js";
import { axiosInstance } from "../../libs/axios.js";
import UserListItem from "./UserListItem.jsx";
import NewChatModal from "./NewChatModel.jsx";
import MessageRequestsModal from "./MessageRequestsModal.jsx";

export default function Sidebar({ currentUser, selectedUser }) {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.auth.onlineUsers) || [];
  
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true); // Initialized to true to avoid immediate cascading trigger inside effect
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [query, setQuery] = useState("");

  // Reusable callback hook for triggering manual sidebar profile refreshes
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

  // Strict compiler compliant mount lifecycle synchronization setup
  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      try {
        const res = await axiosInstance.get("/auth/sidebar");
        if (isMounted) {
          setConnections(res.data);
        }
      } catch (error) {
        console.error("Error on mount fetch:", error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initFetch();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handler for removing a connection from the list
  const handleRemoveUser = async (e, userId) => {
    e.stopPropagation(); // CRITICAL: Stops the row wrapper click handler from selecting the conversation tab
    
    if (!window.confirm("Are you sure you want to remove this user from your conversations?")) {
      return;
    }

    try {
      // In Axios, DELETE payload arguments must be declared inside a nested 'data' field wrapper
      await axiosInstance.delete("/auth/disconnect", {
        data: { targetUserId: userId }
      });
      
      // Instantly synchronize view states by triggering database re-fetch execution chain
      fetchConnections();
      
      // If the removed connection happens to be the active open room frame layout, close it out
      if (selectedUser?._id === userId) {
        dispatch(setSelectedUser(null));
      }
    } catch (error) {
      console.error("Error removing connection item:", error.message);
    }
  };

  const handleModalClose = () => {
    setShowNewChatModal(false);
    fetchConnections(); 
  };

  const filteredUsers = connections.filter((u) =>
    `${u.fullName}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <aside style={{ display: "flex", flexDirection: "column", height: "100%", background: "#1e1e1e", color: "#fff", padding: "16px" }}>
      {/* Search Header layout container */}
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "12px", marginTop: 0 }}>Chats</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="text"
            placeholder="Search active chats..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #444", background: "transparent", color: "#fff", outline: "none" }}
          />

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
            title="Add new user"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              borderRadius: "50%",
              border: "none",
              background: "#4f46e5",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <Plus size={18}  />
          </button>
        </div>
      </div>

      {/* Active Chats scroll section area */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading && <p style={{ padding: "10px", fontSize: "14px", color: "#aaa" }}>Loading chats...</p>}
        
        {!loading && connections.length === 0 && (
          <p style={{ padding: "10px", fontSize: "14px", color: "#aaa" }}>
            No active conversations. Click "+" to add someone!
          </p>
        )}

        {!loading && filteredUsers.map((user) => (
          <div 
            key={user._id} 
            className="sidebar-row-item"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "8px", transition: "background 0.2s" }}
          >
            {/* List Row component wrapper trigger selection context */}
            <div style={{ flex: 1 }}>
              <UserListItem
                user={user}
                isActive={selectedUser?._id === user._id}
                isOnline={onlineUsers.includes(user._id)}
                onClick={() => dispatch(setSelectedUser(user))}
              />
            </div>

            {/* Red delete disconnect target trigger action option element button */}
            <button
              onClick={(e) => handleRemoveUser(e, user._id)}
              title="Remove Chat"
              style={{
                background: "transparent",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                opacity: 0.7,
                transition: "opacity 0.2s, background 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = "#2d2d2d"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.background = "transparent"; }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Global query popup modal layout visibility toggler */}
      {showNewChatModal && (
        <NewChatModal 
          onClose={handleModalClose} 
          onUserAdded={fetchConnections}
        />
      )}

      {/* Message Requests Modal */}
      <MessageRequestsModal />
    </aside>
  );
}
