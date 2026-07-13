import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

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
      });
  },
});

export const { setSelectedUser, addMessage, setIsTyping, setReplyingTo, setForwardingMessage} =
  chatSlice.actions;
export default chatSlice.reducer;
