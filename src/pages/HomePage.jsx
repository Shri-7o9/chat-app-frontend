import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";

const HomePage = () => {
  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
      {/* Left side Sidebar fixed width */}
      <div style={{ width: "300px", flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Right side Chat area fills remaining space */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChatWindow />
        <MessageInput />
      </div>
    </div>
  );
};

export default HomePage;
