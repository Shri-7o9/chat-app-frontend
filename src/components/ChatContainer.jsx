import { useDispatch, useSelector } from "react-redux";
import {  getMessages,sendMessage, setReplyingTo, markMessagesAsRead, editMessage, setForwardingMessage, reactToMessage} from "../stores/chatSlice";
import { useEffect, useRef, useState } from "react";
import ForwardModal from "./ForwardModal";
import { deleteMessageForMe,unsendMessage } from "../stores/chatSlice";

const reactionEmojis=["🙏","👍","❤️","😒","😢","😂","😭","🤮"]

const formatTime=(dataString)=>{
    const date=new Date(dataString)
    return date.toLocaleString("en-US",{
        month:"short", day:"numeric",
        year:"numeric", hour:"numeric",
        minute:"2-digit", hour12: true,
    })
}

const MessageStatus=({message})=>{
    if(message.read){
        return <span style={{color:"#4fc3f7"}}>✔✔</span>
    }
    if(message.delivered){
        return <span>✔✔</span>
    }
    return <span>✔</span>
}

const ChatContainer=()=>{
    const dispatch=useDispatch()
    const {selectedUser,messages,isMessagesLoading, isTyping, replyingTo}=useSelector((state)=>state.chat)
    const {authUser, onlineUsers}=useSelector((state)=>state.auth)

    const [text,setText]=useState("")
    const messageEndRef=useRef(null)

    const isOnline= onlineUsers.includes(selectedUser?._id)

    const [editMessageId,setEditingMessageId]=useState(null)
    const [editText,setEditText]=useState("")
    const [reactionPickerFor,setReactionPickerFor]=useState(null)

    useEffect(()=>{
        if(selectedUser?._id){
            dispatch(getMessages(selectedUser._id))
            dispatch(markMessagesAsRead(selectedUser._id))
        }
    },[selectedUser,dispatch])

    useEffect(()=>{
        messageEndRef.current?.scrollIntoView({behavior:"smooth"})
    },[messages])

    const handleSend=(e)=>{
        e.preventDefault()
        if(!text.trim()) return 

        const data={text}
        if(replyingTo){
            data.replyTo=replyingTo._id
        }

        dispatch(sendMessage({userId:selectedUser._id,data}))
        setText("")
    }

    const handleReplyClick=(message)=>{
        dispatch(setReplyingTo(message))
    }

    const cancelReply=()=>{
        dispatch(setReplyingTo(null))
    }

    const findRepliedMessage=(replyToId)=>{
        return messages.find((m)=>m._id===replyToId)
    }

    const startEdit=(message)=>{
        setEditingMessageId(message._id)
        setEditText(message.text)
    }

    const cancelEdit=()=>{
        setEditingMessageId(null)
        setEditText("")
    }

    const saveEdit=(messageId)=>{
        if(!editText.trim()) return 
         dispatch(editMessage({messageId,text:editText}))
         setEditingMessageId(null)
         setEditText("")
    }

    const handleReact=(messageId,emoji)=>{
        dispatch(reactToMessage({messageId,emoji}))
        setReactionPickerFor(null)
    }

    const handleDeleteForMe=(messageId)=>{
        if(window.confirm("Delete this message for you?")){
            dispatch(deleteMessageForMe(messageId))
        }
    }
    const handleUnsend=(messageId)=>{
        if(window.confirm("Unsend this message?")){
            dispatch(unsendMessage(messageId))
        }
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
                    const isSender = message.senderId === authUser._id
                        console.log("DEBUG:", {
                        senderId: message.senderId,
                        senderIdType: typeof message.senderId,
                        authUserId: authUser._id,
                        authUserIdType: typeof authUser._id,
                        isSender
                        })  
                    const messageDate=new Date(message.createdAt).toDateString()
                    const showDivider=messageDate!==lastDate
                    lastDate=messageDate
                    console.log(isSender);
                    
                    const repliedMessage=message.replyTo ? findRepliedMessage(message.replyTo):null
                    const isEditing=editMessageId===message._id

                    return(
                        <div key={message._id}>
                            {showDivider && <div>{formatTime(message.createdAt)}</div>}

                            <div onDoubleClick={()=> handleReplyClick(message)}>
                                {!isSender && (
                                    <img
                                    src={selectedUser.profilePic||"/avatar-placeholder.png"}
                                    alt={selectedUser.fullName}
                                    />
                                    )}
                            
                                <div>
                                    {message.forwarded && <span>Forwarded</span>}
 
                                    {repliedMessage && (
                                        <div>
                                            <span>
                                                {repliedMessage.senderId===authUser._id ? "You":selectedUser.fullName}
                                            </span>
                                            <p>{repliedMessage.text}</p>
                                        </div>
                                    )}

                                    {isEditing?(
                                        <div>
                                            <input
                                                type="text"
                                                value={editText}
                                                onChange={(e)=> setEditText(e.target.value)}
                                            />
                                            <button type="button" onClick={()=> saveEdit(message._id)}>Save</button>
                                            <button type="button" onClick={cancelEdit}>Cancel</button>
                                        </div>
                                    ):message.unsent?(
                                        <p><em>This message was deleted</em></p>
                                    ):(
                                        <>
                                            <p>
                                                {message.text}
                                                {message.edited && <span>(edited)</span>}
                                            </p>
                                            <span>{formatTime(message.createdAt)}</span>
                                            {isSender && <MessageStatus message={message}/>}
                                        </>
                                    )}

                                    {message.reactions?.length>0&&(
                                        <div>
                                            {message.reactions.map((r)=>(
                                                <span key={r.userId + r.emoji} title={r.userId === authUser._id ? "You":""}>
                                                    {r.emoji}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {!isEditing && !message.unsent &&(
                                        <div>
                                            {isSender && (
                                                <button type="button" onClick={()=> startEdit(message)}>Edit</button>

                                            )}
                                            <button type="button" onClick={()=>dispatch(setForwardingMessage(message))}>
                                                Forward
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={()=> setReactionPickerFor(reactionPickerFor===message._id?null:message._id)}>
                                                    React
                                            </button>
                                            <button type="button" onClick={()=>handleDeleteForMe(message._id)}>
                                                Delete for me
                                            </button>
                                            {isSender && (
                                                <button type="button" onClick={()=>handleUnsend(message._id)}>
                                                    Unsend
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {reactionPickerFor===message._id && (
                                        <div>
                                            {reactionEmojis.map((emoji)=>(
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={()=>handleReact(message._id,emoji)}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    
                                </div>

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

            {replyingTo && (
                <div>
                    <div>
                        <span>
                            Replying to {replyingTo.senderId===authUser._id ? "Yourself":selectedUser.fullName}
                        </span>
                        <p>{replyingTo.text}</p>
                    </div>
                    <button type="button" onClick={cancelReply}>✕</button>
                </div>
            )}

            <form onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e)=>setText(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>

            <ForwardModal/>
        </>
    )
}

export default ChatContainer