import { useDispatch, useSelector } from "react-redux";
import {  getMessages,sendMessage} from "../stores/chatSlice";
import { useEffect, useRef, useState } from "react";


const formatTime=(dataString)=>{
    const date=new Date(dataString)
    return date.toLocaleString("en-US",{
        month:"short",
        day:"numeric",
        year:"numeric",
        hour:"numeric",
        minute:"2-digit",
        hour12: true,
    })
}

const ChatContainer=()=>{
    const dispatch=useDispatch()
    const {selectedUser,messages,isMessagesLoading, isTyping}=useSelector((state)=>state.chat)
    const {authUser, onlineUsers}=useSelector((state)=>state.auth)

    const [text,setText]=useState("")
    const messageEndRef=useRef(null)

    const isOnline= onlineUsers.includes(selectedUser?._id)

    useEffect(()=>{
        if(selectedUser?._id){
            dispatch(getMessages(selectedUser._id))
        }
    },[selectedUser,dispatch])

    useEffect(()=>{
        messageEndRef.current?.scrollIntoView({behavior:"smooth"})
    },[messages])

    const handleSend=(e)=>{
        e.prenevtDefault()
        if(!text.trim())
            return dispatch(sendMessage({userId:selectedUser._id,data:{text}}))
            setText("")
    }

    if(!selectedUser){
        return <div>Select a user to start chatting</div>
    }

    if(isMessagesLoading){
        return <div>Loading messages...</div>
    }

    let lastDate=null

    return(
        <>
            <div>
                <h2>{selectedUser.fullName}</h2>
                <p>{isOnline ? "Active":"Offline"}</p>
            </div>

            <div>
                {messages.map((message)=>{
                    const isSender=message.senderId===authUser._id
                    const messageDate=newDate(message.createdAt).toDateString()
                    const showDivider=messageDate!==lastDate
                    lastDate=messageDate

                    return(
                        <div key={message._id}>
                            {showDivider && <div>{formatTime(message.createdAt)}</div>}

                            <div>
                                {!isSender && (
                                    <img
                                    src={selectedUser.profilePic||"/avatar-placeholder.png"}
                                    alt={selectedUser.fullName}
                                    />
                                    )}
                            
                                <div>{message.text}</div>
                                {isSender && (
                                    <img
                                    src={authUser.profilePic||"/avatar-placeholder.png"}
                                    alt="me"
                                    />
                                )}
                            </div>
                        </div>
                     )
                })}

                {isTyping && (
                    <div>
                        <img src={selectedUser.profilePic||"/avatar-placeholder.png"} alt=""/>
                        {selectedUser.fullName} is typing
                    </div>

                )}

                
                <div ref={messageEndRef}/>
            </div>

            <form onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e)=>setText(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </>
    )
}

export default ChatContainer