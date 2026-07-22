import { useDispatch } from "react-redux";
import { setForwardingMessage } from "../../stores/chatSlice";

const reactionEmojis = ["🙏", "👍", "❤️", "😒", "😢", "😂", "😭", "🤮"];

const MessageActions = ({
  message,
  isOwn,
  reactionPickerFor,
  setReactionPickerFor,
  onEdit,
  onDeleteForMe,
  onUnsend,
  onReact,
}) => {
  const dispatch = useDispatch();

  return (
    <div>
      {isOwn && (
        <button type="button" onClick={() => onEdit(message)}>
          Edit
        </button>
      )}
      <button
        type="button"
        onClick={() => dispatch(setForwardingMessage(message))}
      >
        Forward
      </button>
      <button
        type="button"
        onClick={() =>
          setReactionPickerFor(
            reactionPickerFor === message._id ? null : message._id,
          )
        }
      >
        React
      </button>
      <button type="button" onClick={() => onDeleteForMe(message._id)}>
        Delete for me
      </button>
      {isOwn && (
        <button type="button" onClick={() => onUnsend(message._id)}>
          Unsend
        </button>
      )}

      {reactionPickerFor === message._id && (
        <div>
          {reactionEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onReact(message._id, emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageActions;
