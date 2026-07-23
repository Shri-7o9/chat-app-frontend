import { useDispatch, useSelector } from "react-redux";
import {
  getMessageRequests,
  acceptMessageRequest,
  blockMessageRequest,
  setSelectedUser,
} from "../../stores/chatSlice";

const MessageRequestsModal = () => {
  const dispatch = useDispatch();
  const { messageRequests, isRequestsLoading } = useSelector(
    (state) => state.chat,
  );

  const handleAccept = async (user) => {
    await dispatch(acceptMessageRequest(user._id));
    // open their chat after accepting
    dispatch(setSelectedUser(user));
    document.getElementById("message_requests_modal").close();
  };

  const handleBlock = (userId) => {
    dispatch(blockMessageRequest(userId));
  };

  return (
    <dialog id="message_requests_modal" className="modal">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg mb-1">Message Requests</h3>
        <p className="text-sm text-gray-400 mb-4">
          You can accept or block these messages
        </p>

        {isRequestsLoading ? (
          <p className="text-center text-gray-400 py-4">Loading...</p>
        ) : messageRequests.length === 0 ? (
          <p className="text-center text-gray-400 py-4">No message requests</p>
        ) : (
          <div className="space-y-1">
            {messageRequests.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-colors"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={user.profilePic || "/avatar-placeholder.png"}
                    alt={user.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>

                {/* Name + message preview */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.lastMessage || "Sent you a message"}
                  </p>
                </div>

                {/* Accept / Block buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    className="btn btn-sm btn-primary rounded-full px-4"
                    onClick={() => handleAccept(user)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-sm btn-ghost rounded-full px-4 text-error"
                    onClick={() => handleBlock(user._id)}
                  >
                    Block
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-action mt-4">
          <form method="dialog">
            <button className="btn btn-ghost btn-sm">Close</button>
          </form>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default MessageRequestsModal;
