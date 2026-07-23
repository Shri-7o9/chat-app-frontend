import { useDispatch, useSelector } from "react-redux";
import {
  acceptMessageRequest,
  blockMessageRequest,
  getUsers,
} from "../../stores/chatSlice";

const MessageRequestActions = ({ selectedUser, onAccept, onBlock }) => {
  const dispatch = useDispatch();
  const { isRequestsLoading } = useSelector((state) => state.chat);

  const handleAccept = async () => {
    await dispatch(acceptMessageRequest(selectedUser._id));
    // refresh connections so user appears in sidebar instantly
    dispatch(getUsers());
    onAccept();
  };

  const handleBlock = async () => {
    if (window.confirm(`Block ${selectedUser.fullName}?`)) {
      await dispatch(blockMessageRequest(selectedUser._id));
      onBlock();
    }
  };

  return (
    <div className="border-t bg-base-100 p-4">
      <p className="text-center text-sm text-gray-400 mb-3">
        {selectedUser.fullName} is not in your connections
      </p>
      <div className="flex gap-3 justify-center">
        <button
          className="btn btn-primary rounded-full px-8"
          onClick={handleAccept}
          disabled={isRequestsLoading}
        >
          Accept
        </button>
        <button
          className="btn btn-ghost rounded-full px-8 text-error border border-error"
          onClick={handleBlock}
          disabled={isRequestsLoading}
        >
          Block
        </button>
      </div>
    </div>
  );
};

export default MessageRequestActions;
