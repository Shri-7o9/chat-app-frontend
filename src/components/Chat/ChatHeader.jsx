export default function ChatHeader({ user, isOnline }) {
  return (
    <div>
      <p>{user.fullName}</p>
      <p>{isOnline ? "Online" : "Offline"}</p>
    </div>
  );
}