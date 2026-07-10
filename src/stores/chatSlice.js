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

const chatSlice = createSlice({
  name: "Chat",
  initialState: {
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isTyping: false,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setIsTyping: (state, action) => {
      state.isTyping = action.payload;
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
      });
  },
});

export const { setSelectedUser, addMessage, setIsTyping } = chatSlice.actions;
export default chatSlice.reducer;
