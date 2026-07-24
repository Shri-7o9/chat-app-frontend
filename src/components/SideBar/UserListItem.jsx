export default function UserListItem({ user, isActive, isOnline, onClick }) {
  // Safe Fallback: If fullName exists, use it. Otherwise, combine firstName and lastName.
  const displayName =
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Unknown User";

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3"
      style={{
        fontWeight: isActive ? "bold" : "normal",
        cursor: "pointer",
      }}
    >
      <div className="relative flex-shrink-0">
        <img
          src={user.profilePic || "/avatar-placeholder.png"}
          alt={displayName}
          className="w-10 h-10 rounded-full object-cover"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
      <span className="truncate">{displayName}</span>
    </div>
  );
}
