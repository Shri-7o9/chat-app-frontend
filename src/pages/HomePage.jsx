import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../stores/chatSlice.js";
import Sidebar from "../components/SideBar/SideBar.jsx";
import ChatWindow from "../components/Chat/ChatWindow.jsx";

export default function HomePage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.authUser);
  const { users, selectedUser } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 min-h-0">
        <Sidebar
          users={users}
          currentUser={currentUser}
          selectedUser={selectedUser}
        />
        <ChatWindow selectedUser={selectedUser} currentUser={currentUser} />
      </div>
    </div>
  );
}
