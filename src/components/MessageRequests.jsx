import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { acceptMessageRequest, blockMessageRequest, getMessageRequests, setSelectedUser } from "../stores/chatSlice"

const MessageRequests=()=>{
    const dispatch=useDispatch()
    const {messageRequests,isRequestsLoading}=useSelector((state)=>state.chat)

    useEffect(()=>{
        dispatch(getMessageRequests())
    },[dispatch])

    if(isRequestsLoading)
        return <div>Loading requests...</div>

    if(messageRequests.length===0)
        return null

    return(
        <>
            <h3>Message Requests({messageRequests.length})</h3>
            {messageRequests.map((user)=>(
                <div key={user._id}>
                    <img src={user.profilePic||"/avatar-placeholder.png"} alt={user.fullName}/>
                    <span onClick={()=> dispatch(setSelectedUser(user))}>{user.fullName}</span>

                    <button type="button" onClick={()=>dispatch(acceptMessageRequest(user._id))}>
                        Accept
                    </button>
                    <button
                        type="button"
                        onClick={()=>{
                            if(window.confirm(`Block ${user.fullName}?`)){
                                dispatch(blockMessageRequest(user._id))
                            }
                        }}
                    >
                        Block
                    </button>

                </div>
            ))}
        </>
    )
}

export default MessageRequests