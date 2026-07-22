import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import {
  editMessage,
  deleteMessageForMe,
  unsendMessage,
  reactToMessage,
  setReplyingTo,
} from "../../stores/chatSlice";

const formatDate = (dateString) => {
  return new Date(dateString).toDateString();
};

export default function MessageList() {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  const { selectedUser, messages, isTyping } = useSelector(
    (state) => state.chat,
  );

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [reactionPickerFor, setReactionPickerFor] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleEdit = (message) => {
    setEditingMessageId(message._id);
    setEditText(message.text);
  };

  const handleSaveEdit = (messageId) => {
    if (!editText.trim()) return;
    dispatch(editMessage({ messageId, text: editText }));
    setEditingMessageId(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  const handleDeleteForMe = (messageId) => {
    if (window.confirm("Delete this message for you?")) {
      dispatch(deleteMessageForMe(messageId));
    }
  };

  const handleUnsend = (messageId) => {
    if (window.confirm("Unsend this message?")) {
      dispatch(unsendMessage(messageId));
    }
  };

  const handleReact = (messageId, emoji) => {
    dispatch(reactToMessage({ messageId, emoji }));
    setReactionPickerFor(null);
  };

  const handleReply = (message) => {
    dispatch(setReplyingTo(message));
  };

  if (!selectedUser) return null;

  let lastDate = null;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto space-y-1 px-4 py-3 bg-white">
      {messages.length === 0 ? (
        <div className="mt-10 text-center text-gray-400">
          No messages yet. Say hi 👋
        </div>
      ) : (
        messages.map((msg) => {
          const isOwn = msg.senderId !== selectedUser?._id;
          const messageDate = formatDate(msg.createdAt);
          const showDivider = messageDate !== lastDate;
          lastDate = messageDate;
          const isEditing = editingMessageId === msg._id;

          return (
            <div key={msg._id}>
              {showDivider && (
                <div className="text-center text-xs text-gray-400 my-2">
                  {messageDate}
                </div>
              )}

              {isEditing ? (
                <div
                  className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(msg._id)}
                      className="text-sm text-blue-500"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-sm text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <MessageBubble
                  message={msg}
                  isOwn={isOwn}
                  selectedUser={selectedUser}
                  reactionPickerFor={reactionPickerFor}
                  setReactionPickerFor={setReactionPickerFor}
                  onEdit={handleEdit}
                  onDeleteForMe={handleDeleteForMe}
                  onUnsend={handleUnsend}
                  onReact={handleReact}
                  onReply={handleReply}
                />
              )}
            </div>
          );
        })
      )}

      {isTyping && selectedUser && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <img
            src={selectedUser.profilePic || "/avatar-placeholder.png"}
            alt=""
            className="w-6 h-6 rounded-full"
          />
          {selectedUser.firstName} is typing...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
