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
   <aside
  data-theme="corporate"
  className="w-[300px] min-w-[300px] flex-shrink-0 h-full bg-base-200 border-r border-base-300 flex flex-col"
>
      <div className="p-4 ">
        <h2 className="text-3xl font-normal text-center mb-4">Chats</h2>
        
        <div className="flex items-center gap-1 w-full">

         <label className="flex flex-1 min-w-0 items-center h-10 px-2 bg-white border-2 border-gray-400 rounded-full shadow-sm">
  <input
            type="text"
            placeholder="Search active chats"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex:1, padding: "8px 15px", background:"transparent", color: "black", outline: "none" }}
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
  title="Add new user"
  className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-110 transition-all duration-300 flex-shrink-0"
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
            <Plus size={20}  />
          </button>
        </div>
      </div>

      {/* Active Chats scroll section area */}
      {/* Active Chats scroll section area */}
<div style={{ flex: 1, overflowY: "auto" }}>
  {loading && (
    <p className="p-3 text-sm text-gray-400">
      Loading chats...
    </p>
  )}

  {!loading && connections.length === 0 && (
    <p className="p-3 text-sm text-gray-400">
      No active conversations. Click "+" to add someone!
    </p>
  )}

  {!loading &&
    filteredUsers.map((user) => (
      <div
        key={user._id}
        className={`flex items-center justify-between mx-2 my-2 p-2 rounded-xl transition-all duration-200 ${
          selectedUser?._id === user._id
            ? "bg-gray-500 text-white"
            : "bg-base-300 hover:bg-gray-600 text-white"
        }`}
      >
        <div className="flex-1">
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
              onMouseEnter={(e) => { 
                e.currentTarget.style.opacity = "1"; 
                e.currentTarget.style.background = "#2d2d2d"; }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.opacity = "0.7"; 
                e.currentTarget.style.background = "transparent"; }}
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
