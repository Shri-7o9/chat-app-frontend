import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, setReplyingTo } from "../../stores/chatSlice";

export default function MessageInput({ selectedUser }) {
  const dispatch = useDispatch();
  const { replyingTo } = useSelector((state) => state.chat);
  const { authUser } = useSelector((state) => state.auth);
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

    // BACK TO ORIGINAL SIGNATURE
    dispatch(
      sendMessage({
        userId: selectedUser._id,
        text,
        replyTo: replyingTo?._id || null,
      }),
    );

    setText("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
    }

    setIsExpanded(false);
    dispatch(setReplyingTo(null));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gray-100" data-theme="corporate">
      {replyingTo && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-t text-sm">
          <div>
            <span className="font-semibold text-blue-600">
              Replying to{" "}
              {replyingTo.senderId !== selectedUser?._id
                ? "Yourself"
                : selectedUser?.firstName}
            </span>
            <p className="truncate text-gray-500">{replyingTo.text}</p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(setReplyingTo(null))}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <div className="border-t bg-gray-100 p-4">
        <div className="flex items-center gap-3">
          <textarea
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="flex-1 resize-none bg-white rounded-full border border-gray-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium border border-gray-500 text-white hover: hover:scale-115 transition-all duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}