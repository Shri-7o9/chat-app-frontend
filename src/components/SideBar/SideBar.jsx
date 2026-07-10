import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../stores/chatSlice.js";
import UserListItem from "./UserListItem";

export default function Sidebar({ users, currentUser, selectedUser }) {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.auth.onlineUsers) || [];
  console.log("users:", JSON.stringify(users, null, 2));

  return (
    <aside>
      <div>
        <h2>Chats</h2>
        <input type="text" placeholder="Search users..." />
      </div>

      <div>
        {users.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            isActive={selectedUser?._id === user._id}
            isOnline={onlineUsers.includes(user._id)}
            onClick={() => dispatch(setSelectedUser(user))}
          />
        ))}
      </div>

      <div>
        <span>{currentUser?.fullName}</span>
      </div>
    </aside>
  );
}
