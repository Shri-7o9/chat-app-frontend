export default function UserListItem({ user, isActive,isOnline, onClick }) {
  return (
    <div onClick={onClick} style={{ fontWeight: isActive ? "bold" : "normal" }}>
      <span>{user.fullName}</span>
      <span>{isOnline ? " (Online)" : " (Offline)"}</span>
    </div>
  );
}