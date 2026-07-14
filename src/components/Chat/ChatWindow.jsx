import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare } from "lucide-react";
import { getMessages } from "../../stores/chatSlice.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";

export default function ChatWindow({ selectedUser, currentUser }) {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.auth.onlineUsers);

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessages(selectedUser._id));
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
    <div className="flex flex-1 flex-col min-h-0">
      <ChatHeader
        user={selectedUser}
        isOnline={onlineUsers.includes(selectedUser._id)}
      />
      <MessageList selectedUser={selectedUser} currentUser={currentUser} />
      <MessageInput selectedUser={selectedUser} />
    </div>
  );
}
