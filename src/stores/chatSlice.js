import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";
import { act } from "react";

export const getUsers = createAsyncThunk(
  "chat/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/messages/users");
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load users";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load messages";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/messages/send/${userId}`, data);
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send Message";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async (senderId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/messages/read/${senderId}`);
      return { senderId, ...res.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "failed to update read status",
      );
    }
  },
);

export const editMessage = createAsyncThunk(
  "chat/editMessage",
  async ({ messageId, text }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/messages/${messageId}`, { text });
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to edit the message";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const forwardMessage = createAsyncThunk(
  "chat/forwardMessage",
  async ({ messageId, toUserId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/messages/forwars/${messageId}`, {
        toUserId,
      });
      toast.success("Message forwarded");
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to forward";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const reactToMessage = createAsyncThunk(
  "chat/reactToMessage",
  async ({ messageId, emoji }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/messages/react/${messageId", {
        emoji,
      });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to react";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const deleteMessageForMe = createAsyncThunk(
  "chat/deleteMessageForMe",
  async (messageId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}/me`);
      return messageId;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete message";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const unsendMessage = createAsyncThunk(
  "chat/unsendMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/messages/${messageId}/everyone`);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to unsend message";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const getMessageRequests = createAsyncThunk(
  "chat/getMessageRequests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/messages/requests");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load request",
      );
    }
  },
);

export const acceptMessageRequest = createAsyncThunk(
  "chat/acceptMessageRequest",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `messages/requests/${userId}/accept`,
      );
      toast.success("Request accepted");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to accept request";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const blockMessageRequest = createAsyncThunk("chat/blockMessageRequest",
  async(userId,{rejectWithValue})=>{
    try{
      await axiosInstance.post(`/messages/requests/${userId}/block`)
      toast.success("User Blocked")
      return userId
    }catch(error){
      const message=error.response?.data?.message||"Failed to block user"
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

const chatSlice = createSlice({
  name: "Chat",
  initialState: {
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isTyping: false,
    replyingTo: null,
    forwardingMessage: null,
    messageRequests:[],
    isRequestsLoading:false,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = [];
      state.replyingTo = null;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setIsTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    setReplyingTo: (state, action) => {
      state.replyingTo = action.payload;
    },
    setForwardingMessage: (state, action) => {
      state.forwardingMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isUsersLoading = false;
      })
      .addCase(getUsers.rejected, (state) => {
        state.isUsersLoading = false;
      })

      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.isMessagesLoading = false;
      })
      .addCase(getMessages.rejected, (state) => {
        state.isMessagesLoading = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.message.push(action.payload);
        state.replyingTo = null;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        state.messages = state.messages.map((msg) =>
          msg.senderId === action.payload.senderId
            ? { ...msg, read: true }
            : msg,
        );
      })
      .addCase(editMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(
          (m) => m._id === action.payload._id,
        );
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      .addCase(forwardMessage.fulfilled, (state) => {
        state.forwardingMessage = null;
      })
      .addCase(reactToMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(
          (m) => m._id === action.payload._id,
        );
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      .addCase(deleteMessageForMe.fulfilled, (state, action) => {
        state.messages = state.messages.filter((m) => m._id !== action.payload);
      })
      .addCase(unsendMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(
          (m) => m._id === action.payload._id,
        );
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      .addCase(getMessageRequests.pending,(state)=>{
        state.isRequestsLoading=true
      })
      .addCase(getMessageRequests.fulfilled,(state,action)=>{
        state.messageRequests = action.payload;
        state.isRequestsLoading = false;
      })
      .addCase(getMessageRequests.rejected,(state)=>{
        state.isRequestsLoading=false
      })
      .addCase(acceptMessageRequest.fulfilled,(state,action)=>{
        state.messageRequests=state.messageRequests.filter((u)=>u._id !== action.payload.userId)
        if(!state.users.some((u)=>u.id===action.payload.userId)){
          const accepted=state.messageRequests.find((u)=>u._id===action.payload.userId)
          if (accepted) state.users.push(accepted)
        }
      })
      .addCase(blockMessageRequest.fulfilled,(state,action)=>{
        state.messageRequests=state.messageRequests.filter((u)=>u._id !==action.payload)
      })
  },
});

export const {
  setSelectedUser,
  addMessage,
  setIsTyping,
  setReplyingTo,
  setForwardingMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
