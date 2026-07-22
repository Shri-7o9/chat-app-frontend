import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { sendMessage } from "../../stores/chatSlice.js";

export default function MessageInput({ selectedUser }) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);

  const handleTextareaChange = (e) => {
    setText(e.target.value);

    const textarea = textareaRef.current;
    textarea.style.height = "auto";

    const lineHeight = 24;
    const maxHeight = 10 * lineHeight;
    const height = Math.min(textarea.scrollHeight, maxHeight);

    textarea.style.height = `${height}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";

    // Change to rectangle after 3 lines
    setIsExpanded(height > lineHeight * 3);
  };

  const handleSend = () => {
    if (!text.trim()) return;

    dispatch(sendMessage({ userId: selectedUser._id, text }));

    setText("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
    }

    setIsExpanded(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="bg-base-100"
      data-theme="corporate"
    >
      <div className="border-t bg-gray-100 p-4">
        <div className="flex items-center gap-3">
          <textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={text}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            rows={1}
            className={`flex-1 resize-none bg-white border border-gray-500 px-3 py-2 text-sm leading-6 focus:outline-none focus:ring-2 overflow-hidden transition-all duration-200 ${
              isExpanded ? "rounded-2xl" : "rounded-full"
            }`}
          />
          <button
            onClick={handleSend}
            className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-black border border-gray-500 hover:bg-indigo-100 hover:scale-115 transition-all duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}