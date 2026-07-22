import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Search, X, UserPlus, Check } from "lucide-react";
import { addConnection } from "../../stores/chatSlice.js";
import { axiosInstance } from "../../libs/axios.js";

// FIX: Added 'onUserAdded' to the props destructured here
export default function NewChatModal({ onClose, onUserAdded }) {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Handle user typing and instantly reset UI if empty
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (!value.trim()) {
      setResults([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    // 2. Terminate effect immediately if there is no text
    if (!query.trim()) return;

    const controller = new AbortController();

    const searchUsers = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/auth/search?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal }
        );
        
        // FIX: Extract the 'users' array from your backend object wrapper
        // Fallback to an empty array [] if for some reason it's missing
        setResults(res.data.users || []);
        
      } catch (error) {
        // Prevent clearing state if the user simply typed another character
        if (error.name !== "CanceledError" && !axiosInstance.isCancel(error)) {
          console.error("Error searching users:", error.message);
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // 3. Debounce: waits 350ms for user to stop typing before calling API
    const timeout = setTimeout(() => {
      searchUsers();
    }, 350); 

    // 4. Cleanup: kills timer and drops late network responses
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const handleAddUser = async (user) => {
    try {
      await dispatch(addConnection(user._id)).unwrap();
      
      // Update local modal state to show "Added" checkmark
      setResults((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, alreadyAdded: true } : u))
      );

      // FIX: Trigger the sidebar to instantly re-fetch its list from the server
      if (onUserAdded) {
        onUserAdded();
      }
    } catch (error) {
      console.log("Error adding user:", error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#1e1e1e",
          color: "#fff",
          borderRadius: "8px",
          width: "400px",
          maxWidth: "90%",
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          padding: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h2 style={{ margin: 0, fontSize: "18px" }}>Add New User</h2>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid #444", borderRadius: "6px", padding: "6px 10px", marginBottom: "12px" }}>
          <Search size={16} />
          <input
            autoFocus
            type="text"
            placeholder="Search by name or username..."
            value={query}
            onChange={handleInputChange}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff" }}
          />
        </div>

        <div style={{ overflowY: "auto" }}>
          {loading && <p>Searching...</p>}
          
          {!loading && query.trim().length > 0 && results.length === 0 && (
            <p>No users found.</p>
          )}

          {!loading && results.length > 0 && (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {results.map((user) => (
                <li
                  key={user._id}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid #333" }}
                >
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName || "Avatar"}
                    style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>{user.fullName}</span>
                    {user.userName && (
                      <span style={{ fontSize: "12px", color: "#aaa" }}>@{user.userName}</span>
                    )}
                  </div>

                  {user.alreadyAdded ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#4ade80", fontSize: "14px" }}>
                      <Check size={16} /> Added
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAddUser(user)}
                      style={{ display: "flex", alignItems: "center", gap: "4px", background: "#4f46e5", border: "none", color: "#fff", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", fontSize: "14px" }}
                    >
                      <UserPlus size={16} /> Add
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
