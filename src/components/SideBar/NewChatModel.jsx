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

  const handleSelectUser = (user) => {
    dispatch(setSelectedUser(user));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>New Chat</h2>
          <button onClick={onClose} className="close-btn">
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
            onChange={handleInputChange}
          />
        </div>

        {/* Dynamic UI States */}
        {loading && <div className="loading-state">Searching...</div>}

        {!loading && query.trim().length > 0 && results.length === 0 && (
          <div className="no-results">No users found.</div>
        )}

        {!loading && results.length > 0 && (
          <ul className="modal-results">
            {results.map((user) => (
              <li key={user._id} onClick={() => handleSelectUser(user)}>
                <img 
                  src={user.profilePic || "/avatar.png"} 
                  alt={user.fullName || "User avatar"} 
                />
                <div className="user-info">
                  <p className="full-name">{user.fullName}</p>
                  {user.userName && <span className="username">@{user.userName}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
