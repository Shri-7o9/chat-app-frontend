import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Search, X } from "lucide-react";
import { setSelectedUser } from "../../stores/chatSlice.js";
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

  const handleSelectUser = (user) => {
    dispatch(setSelectedUser(user));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>New Chat</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-search">
          <Search size={16} />
          <input
            autoFocus
            type="text"
            placeholder="Search by name or username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading && <p>Searching...</p>}

        {!loading && query.trim().length > 0 && results.length === 0 && (
          <p>No users found.</p>
        )}

        {!loading && results.length > 0 && (
          <ul className="modal-results">
            {results.map((user) => (
             <li key={user._id} onClick={() => handleSelectUser(user)}>
  <img src={user.profilePic || "/avatar.png"} alt={user.firstName} />
  <div>
    <p>{user.firstName} {user.lastName}</p>
  </div>
</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}