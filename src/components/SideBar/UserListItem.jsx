export default function UserListItem({ user, isActive, isOnline, onClick }) {
  // Safe Fallback: If fullName exists, use it. Otherwise, combine firstName and lastName.
  const displayName = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User";

  return (
    <div 
      onClick={onClick} 
      style={{ 
        fontWeight: isActive ? "bold" : "normal",
        display: "flex", 
        alignItems: "center", 
        gap: "8px", 
        padding: "8px", 
        cursor: "pointer" 
      }}
    >
      <span>{displayName}</span>
      {isOnline && <span style={{ color: "green", marginLeft: "6px" }}>●</span>}
    </div>
  );
}
