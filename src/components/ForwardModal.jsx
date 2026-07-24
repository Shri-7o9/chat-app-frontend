import { useDispatch, useSelector } from "react-redux";
import { forwardMessage, setForwardingMessage } from "../stores/chatSlice";

const ForwardModal = () => {
  const dispatch = useDispatch();
  const { forwardingMessage, users } = useSelector((state) => state.chat);

  const handleForward = (toUserId) => {
    dispatch(forwardMessage({ messageId: forwardingMessage._id, toUserId }));
    document.getElementById("forward_modal").close();
  };

  const handleClose = () => {
    dispatch(setForwardingMessage(null));
    document.getElementById("forward_modal").close();
  };

  if (forwardingMessage) {
    setTimeout(() => {
      document.getElementById("forward_modal")?.showModal();
    }, 0);
  }

  return (
    <dialog id="forward_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Forward Message</h3>

        {forwardingMessage && (
          <p className="py-2 text-sm text-gray-500 italic">
            "{forwardingMessage.text}"
          </p>
        )}

        <div className="py-4 space-y-2 max-h-60 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleForward(user._id)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={user.profilePic || "/avatar-placeholder.png"}
                alt={user.fullName}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">{user.fullName}</span>
            </div>
          ))}
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={handleClose}>
              Cancel
            </button>
          </form>
        </div>
      </div>

      {/* outside click closes modal */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
};

export default ForwardModal;
