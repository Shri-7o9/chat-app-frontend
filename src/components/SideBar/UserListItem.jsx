export default function UserListItem({ user, isActive, isOnline, onClick }) {
  return (
    <div onClick={onClick} style={{ fontWeight: isActive ? "bold" : "normal" }}>
      <span>{user.firstName} {user.lastName}</span>
      {isOnline && <span style={{ color: "green", marginLeft: "6px" }}>●</span>}
    </div>
  );
}