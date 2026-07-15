import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList() {
  const bottomRef = useRef(null);
    const { users, selectedUser } = useSelector((state) => state.chat);
  const messages = useSelector((state) => state.chat.messages) || [];
  

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto space-y-1 px-4 py-3">
      {messages.length === 0 ? (
        <div className="mt-10 text-center text-gray-400">
          No messages yet. Say hi 👋
        </div>
      ) : (
        messages.map((msg) => {
          
          const isOwn = msg.senderId !== selectedUser?._id;
          
          return (
            <MessageBubble
              key={msg._id}
              message={msg}
              isOwn={isOwn}
            />
          );
        })
      )}

      <div ref={bottomRef} />
    </div>
  );
}