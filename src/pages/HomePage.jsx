import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../stores/chatSlice.js";
import Sidebar from "../components/SideBar/SideBar.jsx";
import ChatWindow from "../components/Chat/ChatWindow.jsx";
import MessageRequests from "../components/MessageRequests.jsx";

const HomePage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.authUser);
  const { users, selectedUser } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
      {/* Left side — Sidebar fixed width */}
      <div style={{ width: "300px", flexShrink: 0 }}>
        <MessageRequests />
        <Sidebar
          users={users}
          currentUser={currentUser}
          selectedUser={selectedUser}
        />
      </div>

      {/* Right side — Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChatWindow />
      </div>
    </div>
  );
};

export default HomePage;
