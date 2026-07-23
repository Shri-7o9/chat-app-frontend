import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare } from "lucide-react";
import { getMessages, markMessagesAsRead } from "../../stores/chatSlice.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageRequestActions from "./MessageRequestActions.jsx";
import ForwardModal from "../ForwardModal.jsx";

export default function ChatWindow({
  isRequestView,
  onRequestAccept,
  onRequestBlock,
}) {
  const dispatch = useDispatch();
  const { selectedUser, users } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.auth);

  // check if selected user is in connections or is a request
  const isRequestUser =
    selectedUser && !users.some((u) => u._id === selectedUser._id);

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessages(selectedUser._id));
      dispatch(markMessagesAsRead(selectedUser._id));
    }
  }, [selectedUser?._id, dispatch]);

  if (!selectedUser) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-gray-50 text-gray-400">
        <MessageSquare className="h-10 w-10" />
        <p className="text-sm">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-0" data-theme="corporate">
      <ChatHeader
        user={selectedUser}
        isOnline={onlineUsers.includes(selectedUser._id)}
      />
      <MessageList />

      {/* show Accept/Block if request user, otherwise show normal input */}
      {isRequestView && isRequestUser ? (
        <MessageRequestActions
          selectedUser={selectedUser}
          onAccept={onRequestAccept}
          onBlock={onRequestBlock}
        />
      ) : (
        <MessageInput selectedUser={selectedUser} />
      )}

      <ForwardModal />
    </div>
  );
}
