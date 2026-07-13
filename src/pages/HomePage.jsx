import { useSelector } from "react-redux";
import ChatContainer from "../components/ChatContainer"

import Navbar from "../components/Navbar";

const HomePage = () => {
  const {selectedUser}=useSelector((state)=>state.chat)

  return(
    <>
      <div style={{ flex: 1 }}>
        {selectedUser ? (
          <ChatContainer />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            Select a user to start chatting
          </div>
        )}
      </div>
    </>
    
  )
  
  
}

export default HomePage;
