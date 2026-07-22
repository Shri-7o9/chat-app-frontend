import MessageStatus from "./MessageStatus";
import MessageActions from "./MessageActions";

export default function MessageBubble({
  message,
  isOwn,
  selectedUser,
  reactionPickerFor,
  setReactionPickerFor,
  onEdit,
  onDeleteForMe,
  onUnsend,
  onReact,
  onReply,
}) {
  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
      onDoubleClick={() => onReply(message)}
    >
      {!isOwn && selectedUser && (
        <img
          src={selectedUser.profilePic || "/avatar-placeholder.png"}
          alt={selectedUser.firstName}
          className="w-8 h-8 rounded-full mr-2 self-end"
        />
      )}

      <div className="flex flex-col max-w-[70%]">
        <div
          className={`px-4 py-3 rounded-2xl break-words shadow-sm
            ${
              isOwn
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-zinc-700 text-white rounded-bl-none"
            }`}
        >
          {message.forwarded && (
            <span className="text-xs opacity-70 block mb-1">Forwarded</span>
          )}

          {message.unsent ? (
            <p>
              <em>This message was deleted</em>
            </p>
          ) : (
            <>
              {message.image && (
                <img
                  src={message.image}
                  alt="attachment"
                  className="rounded-xl max-w-full mb-2"
                />
              )}
              {message.text && (
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                  {message.text}
                  {message.edited && (
                    <span className="text-xs opacity-60 ml-1">(edited)</span>
                  )}
                </p>
              )}
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-75 block text-right">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {isOwn && <MessageStatus message={message} />}
              </div>
            </>
          )}

          {message.reactions?.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {message.reactions.map((r) => (
                <span key={r.userId + r.emoji} className="text-sm">
                  {r.emoji}
                </span>
              ))}
            </div>
          )}
        </div>

        {!message.unsent && (
          <MessageActions
            message={message}
            isOwn={isOwn}
            reactionPickerFor={reactionPickerFor}
            setReactionPickerFor={setReactionPickerFor}
            onEdit={onEdit}
            onDeleteForMe={onDeleteForMe}
            onUnsend={onUnsend}
            onReact={onReact}
          />
        )}
      </div>
    </div>
  );
}
