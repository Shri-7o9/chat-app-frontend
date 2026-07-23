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
  onJumpToMessage,
}) {
  return (
    <div
      id={`msg-${message._id}`}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 transition-colors duration-500 rounded-2xl`}
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

          {!message.unsent && message.replyTo && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onJumpToMessage?.(message.replyTo._id);
              }}
              className={`mb-1.5 cursor-pointer rounded-lg border-l-4 px-2.5 py-1.5
                ${
                  isOwn
                    ? "border-white/70 bg-white/15 hover:bg-white/20"
                    : "border-white/40 bg-black/20 hover:bg-black/30"
                }`}
            >
              <p className="text-xs font-semibold opacity-90">
                {message.replyTo.senderId !== selectedUser?._id
                  ? "You"
                  : selectedUser?.firstName}
              </p>
              {message.replyTo.text ? (
                <p className="text-xs opacity-70 truncate">
                  {message.replyTo.text}
                </p>
              ) : (
                <p className="text-xs italic opacity-70">📷 Photo</p>
              )}
            </div>
          )}

          {message.unsent ? (
            <div>
              <p className="flex items-center gap-1 text-sm italic opacity-70">
                🚫 This message was unsent
              </p>
              <span className="text-xs opacity-75 block text-right mt-1">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
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

          {!message.unsent && message.reactions?.length > 0 && (
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
