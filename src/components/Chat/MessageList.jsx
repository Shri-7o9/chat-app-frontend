import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({ selectedUser, currentUser }) {
  const bottomRef = useRef(null);
  const messages = useSelector((state) => state.chat.messages) || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto space-y-2 px-4 py-3">
      {messages.length === 0 && (
        <p className="mt-4 text-center text-sm text-gray-400">No messages yet</p>
      )}
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          isOwn={msg.senderId === currentUser?._id}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}