import { useSelector } from "react-redux";
import ChatContainer from "../components/ChatContainer"

const HomePage = () => {
  const {selectedUser}=useSelector((state)=>state.chat)

  return (
    <div >
      {selectedUser?<ChatContainer/>:<div>Select a user to start chatting</div>}
    </div>
  )
}

export default HomePage;
