import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, setSelectedUser } from "../stores/chatSlice.js";
import Sidebar from "../components/SideBar/SideBar.jsx";
import ChatWindow from "../components/Chat/ChatWindow.jsx";

const HomePage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.authUser);
  const { users, selectedUser } = useSelector((state) => state.chat);
  const [isRequestView, setIsRequestView] = useState(false);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleRequestAccept = () => {
    // switch back to chats view after accepting
    setIsRequestView(false);
    dispatch(setSelectedUser(null));
    dispatch(getUsers()); // refresh sidebar instantly
  };

  const handleRequestBlock = () => {
    setIsRequestView(false);
    dispatch(setSelectedUser(null));
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
      {/* Left side — Sidebar fixed width */}
      <div style={{ width: "600px", flexShrink: 0 }}>
        <MessageRequests />
        <Sidebar
          users={users}
          currentUser={currentUser}
          selectedUser={selectedUser}
          isRequestView={isRequestView}
          onOpenRequests={() => setIsRequestView(true)}
          onCloseRequests={() => {
            setIsRequestView(false);
            dispatch(setSelectedUser(null));
          }}
        />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChatWindow
          isRequestView={isRequestView}
          onRequestAccept={handleRequestAccept}
          onRequestBlock={handleRequestBlock}
        />
      </div>
    </div>
  );
};

export default HomePage;
