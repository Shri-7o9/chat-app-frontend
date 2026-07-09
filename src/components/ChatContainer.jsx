import { useDispatch, useSelector } from "react-redux";
import {  getMessages,sendMessage} from "../stores/chatSlice";
import { useEffect, useRef, useState } from "react";

const ChatContainer=()=>{
    const dispatch=useDispatch()
    const {selectedUser,messages,isMessagesLoading}=useSelector((state)=>state.chat)
    const {authUser}=useSelector((state)=>state.auth)

    const [text,setText]=useState("")
    const messageEndRef=useRef(null)

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

    return(
        <>
        <div>
            <h2>{selectedUser.fullName}</h2>
        </div>

        <div>
            {messages.map((message)=>(
                <div key={message._id}
                    style={{
                        textAlign: message.senderId === authUser._id ? "right" : "left",
                }}>
                    <p>{message.text}</p>
                </div>
            ))}
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