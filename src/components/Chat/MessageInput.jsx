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
            <div className="bg-base-100"
          data-theme="corporate">
    <div className="border-t bg-base-100 p-4">
      <div className="flex items-center gap-3">
      <textarea
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        className="flex-1 resize-none rounded-full border border-gray-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={handleSend}
        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 hover:scale-115 transition-all duration-200">
        Send
      </button>
    </div>
    </div>
    </div>
  );
}
