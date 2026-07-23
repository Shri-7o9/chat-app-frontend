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
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 group`}
      onDoubleClick={() => onReply(message)}
    >
      {!isOwn && selectedUser && (
        <img
          src={selectedUser.profilePic || "/avatar-placeholder.png"}
          alt={selectedUser.firstName}
          className="w-8 h-8 rounded-full mr-2 self-end"
        />
      )}

      <div
        className={`flex items-center max-w-[70%] ${
          isOwn ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div className="flex flex-col">
          <div
            className={`relative inline-block ${
              isOwn ? "max-w-fit ml-auto" : "max-w-fit"
            }`}
          >
            <div
              className={`inline-block px-4 py-3 rounded-2xl break-words shadow-sm max-w-full
                ${
                  isOwn
                    ? "bg-gray-100 text-black rounded-br-none"
                    : "bg-gray-500 text-white rounded-bl-none"
                }`}
            >
              {message.forwarded && (
                <span className="text-xs opacity-70 block mb-1">
                  Forwarded
                </span>
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
                    <div className="relative">
                      <p className="text-[15px] leading-5 whitespace-pre-wrap break-words pr-14 inline">
                        {message.text}
                        {message.edited && (
                          <span className="text-[11px] opacity-60 ml-1">
                            (edited)
                          </span>
                        )}
                      </p>

                      <div className="absolute bottom-0 right-0 flex items-center gap-1">
                        <span className="text-[11px] opacity-60 leading-none">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Floating reaction */}
            {message.reactions?.length > 0 && (
              <div
                className={`absolute -bottom-2 ${
                  isOwn ? "-right-2" : "-left-2"
                } flex items-center gap-0.5 z-10`}
              >
                {message.reactions.map((r) => (
                  <span
                    key={r.userId + r.emoji}
                    className="text-xl leading-none"
                  >
                    {r.emoji}
                  </span>
                ))}
              </div>
            )}
          </div>
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