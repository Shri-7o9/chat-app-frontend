import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getMessageRequests,
  acceptMessageRequest,
  blockMessageRequest,
  setSelectedUser,
} from "../../stores/chatSlice"

const MessageRequestsModal = () => {
  const dispatch = useDispatch()
  const { messageRequests, isRequestsLoading } = useSelector((state) => state.chat)

  useEffect(() => {
    // only fetch when modal is opened — handled by button click
  }, [])

  const handleOpen = () => {
    dispatch(getMessageRequests())
  }

  const handleAccept = (userId) => {
    dispatch(acceptMessageRequest(userId))
  }

  const handleBlock = (userId) => {
    if (window.confirm("Block this user?")) {
      dispatch(blockMessageRequest(userId))
    }
  }

  const handleSelectUser = (user) => {
    dispatch(setSelectedUser(user))
    document.getElementById("message_requests_modal").close()
  }

  return (
    <dialog id="message_requests_modal" className="modal" onToggle={handleOpen}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Message Requests</h3>

        {isRequestsLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : messageRequests.length === 0 ? (
          <p className="text-center text-gray-400">No message requests</p>
        ) : (
          <div className="space-y-3">
            {messageRequests.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-100"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => handleSelectUser(user)}
                >
                  <img
                    src={user.profilePic || "/avatar-placeholder.png"}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">{user.fullName}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleAccept(user._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleBlock(user._id)}
                  >
                    Block
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>

      {/* outside click closes modal */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default MessageRequestsModal