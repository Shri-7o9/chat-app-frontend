import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessage } from "../../stores/chatSlice.js";

export default function MessageInput({ selectedUser }) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    dispatch(sendMessage({ userId: selectedUser._id, text }));

    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t border-gray-200 bg-white p-3">
      <textarea
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={handleSend}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Send
      </button>
    </div>
  );
}
