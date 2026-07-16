import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../stores/chatSlice.js";

import ChatContainer from "../components/ChatContainer"
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar/SideBar.jsx";
import ChatWindow from "../components/Chat/ChatWindow.jsx";

const HomePage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.authUser);
  const { users, selectedUser } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <div>
  <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
      {/* Left side Sidebar fixed width */}
      <div style={{ width: "300px", flexShrink: 0 }}>
        <Sidebar
          users={users}
          currentUser={currentUser}
          selectedUser={selectedUser}
        />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
      <div style={{ flex: 1 }}>
        {selectedUser ? (
          <ChatContainer />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            Select a user to start chatting
          </div>
        )}
      </div>
        <ChatWindow />
      </div>
    </div>
    </div>
  );
};

export default HomePage;
