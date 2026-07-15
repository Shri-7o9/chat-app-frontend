import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Search, X, UserPlus, Check } from "lucide-react";
import { addConnection } from "../../stores/chatSlice.js";
import { axiosInstance } from "../../libs/axios.js";

export default function NewChatModal({ onClose }) {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await axiosInstance.get(
          `/users/search?q=${encodeURIComponent(query.trim())}`
        );
        setResults(res.data);
      } catch (error) {
        console.log("Error searching users:", error.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleAddUser = async (user) => {
    try {
      await dispatch(addConnection(user._id)).unwrap();
      setResults((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, alreadyAdded: true } : u))
      );
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
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
                    alt={user.firstName}
                    style={{ width: 36, height: 36, borderRadius: "50%" }}
                  />
                  <span style={{ flex: 1 }}>
                    {user.firstName} {user.lastName}
                  </span>
                  {user.alreadyAdded ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#4ade80" }}>
                      <Check size={16} /> Added
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAddUser(user)}
                      style={{ display: "flex", alignItems: "center", gap: "4px", background: "#4f46e5", border: "none", color: "#fff", borderRadius: "6px", padding: "6px 10px", cursor: "pointer" }}
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