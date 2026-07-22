export default function ChatHeader({ user, isOnline }) {
  if (!user) return null;
  return (
        <div className="bg-base-100 "
          data-theme="corporate">
          <div className="border-b bg-base-100 px-6 py-4">
            <p className="text-3xl font-semibold">{user.fullName}</p>
            <p className={`text-sm ${isOnline ?     "text-green-500" : "text-red-500"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
          </div>
  );
}