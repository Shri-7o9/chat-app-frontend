import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../libs/axios.js";

export const getUsers = createAsyncThunk(
  "chat/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/messages/users");
      return res.data;
    } catch (error) {
      console.log("Error in getUsers:", error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
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
      console.log("Error in getMessages:", error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ userId, text, image }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/messages/send/${userId}`, {
        text,
        image,
      });
      return res.data;
    } catch (error) {
      console.log("Error in sendMessage:", error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

const initialState = {
  users: [],
  selectedUser: null,
  messages: [],
  isUsersLoading: false,
  isMessagesLoading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = [];
    },
    // called from your socket "newMessage" listener
    addIncomingMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // getUsers
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

      // getMessages
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

      // sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { setSelectedUser, addIncomingMessage } = chatSlice.actions;
export default chatSlice.reducer;