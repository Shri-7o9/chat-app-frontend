export default function ChatHeader({ user, isOnline }) {
  if (!user) return null;
  return (
    <div>
      <p>{user.firstName} {user.lastName}</p>
      <p>{isOnline ? "Online" : "Offline"}</p>
    </div>
  );
}