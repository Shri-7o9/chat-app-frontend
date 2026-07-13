import { useDispatch, useSelector } from "react-redux"
import { forwardMessage, setForwardingMessage } from "../stores/chatSlice"

const ForwardModal=()=>{
    const dispatch=useDispatch()
    const {forwardingMessage, users}=useSelector((state)=>state.chat)

    if(!forwardingMessage)
        return null

    const handleForward=(toUserId)=>{
        dispatch(forwardMessage({messageId:forwardingMessage._id,toUserId}))
    }

    return(
        <>
            <div>
                <h3>Forward Message</h3>
                <p>"{forwardingMessage.text}"</p>

                {users.map((user)=>(
                    <div key={user._id} onClick={()=>handleForward(user._id)}>
                        <img src={user.profilePic||"/avatar-placeholder.png"} alt={user.fullName}/>
                        <span>{user.fullName}</span>
                    </div>

                ))}

                <button type="button" onClick={()=>dispatch(setForwardingMessage(null))}>
                    Cancel
                </button>
            </div>
        </>
    )
}

export default ForwardModal