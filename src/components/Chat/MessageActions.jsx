import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setForwardingMessage } from "../../stores/chatSlice";
import {
  ChevronDown,
  Forward,
  SmilePlus,
  Trash2,
  Pencil,
  Undo2,
} from "lucide-react";

const reactionEmojis = ["🙏", "👍", "❤️", "😒", "😢", "😂", "😭", "🤮", "😡"];

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
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className={`relative flex items-center gap-1 ${
        isOwn ? "order-1 mr-2" : "order-2 ml-2"
      }`}
    >
      {/* WhatsApp React Button */}
      <button
        type="button"
        onClick={() =>
          setReactionPickerFor(
            reactionPickerFor === message._id ? null : message._id
          )
        }
        className="btn btn-circle btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <SmilePlus size={18} />
      </button>

      {/* WhatsApp Menu Button */}
      <button
        type="button"
        onClick={() => setOpenMenu(!openMenu)}
        className="btn btn-circle btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <ChevronDown size={16} />
      </button>

      {/* Dropdown */}
      {openMenu && (
        <div className="absolute top-8 right-0 z-50 rounded-xl bg-base-100 shadow-lg border border-base-300 p-2 min-w-[180px]">
          <div className="flex flex-col gap-1">
            {isOwn && (
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-300 hover:bg-gray-400 hover:text-white transition-colors text-left"
                onClick={() => {
                  onEdit(message);
                  setOpenMenu(false);
                }}
              >
                <Pencil size={16} />
                <span>Edit</span>
              </button>
            )}

            <button
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-300 hover:bg-gray-400 hover:text-white transition-colors text-left"
              onClick={() => {
                dispatch(setForwardingMessage(message));
                setOpenMenu(false);
              }}
            >
              <Forward size={16} />
              <span>Forward</span>
            </button>

            <button
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-300 hover:bg-red-400 hover:text-white transition-colors text-error text-left"
              onClick={() => {
                onDeleteForMe(message._id);
                setOpenMenu(false);
              }}
            >
              <Trash2 size={16} />
              <span>Delete for me</span>
            </button>

            {isOwn && (
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-300 hover:bg-red-400 hover:text-white transition-colors text-error text-left"
                onClick={() => {
                  onUnsend(message._id);
                  setOpenMenu(false);
                }}
              >
                <Undo2 size={16} />
                <span>Unsend</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {reactionPickerFor === message._id && (
        <div
          className={`absolute ${
            isOwn ? "right-full mr-2" : "left-full ml-2"
          } top-1/2 -translate-y-1/2 flex gap-1 rounded-full bg-base-100 shadow-lg p-2 z-50`}
        >
          {reactionEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="hover:scale-125 transition-transform text-xl"
              onClick={() => {
                onReact(message._id, emoji);
                setReactionPickerFor(null);
              }}
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