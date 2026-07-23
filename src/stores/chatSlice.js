import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../libs/axios.js";

export const getUsers = createAsyncThunk(
  "chat/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/messages/users");
      return res.data;
    } catch (error) {
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
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

// KEPT ORIGINAL SIGNATURE — text and image separate, not wrapped in data
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ userId, text, image, replyTo }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/messages/send/${userId}`, {
        text,
        image,
        replyTo,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const editMessage = createAsyncThunk(
  "chat/editMessage",
  async ({ messageId, text }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/messages/edit/${messageId}`, {
        text,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const deleteMessageForMe = createAsyncThunk(
  "chat/deleteMessageForMe",
  async (messageId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(
        `/messages/delete-for-me/${messageId}`,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const unsendMessage = createAsyncThunk(
  "chat/unsendMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/messages/unsend/${messageId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const forwardMessage = createAsyncThunk(
  "chat/forwardMessage",
  async ({ messageId, toUserId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/messages/forward/${messageId}`, {
        toUserId,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const reactToMessage = createAsyncThunk(
  "chat/reactToMessage",
  async ({ messageId, emoji }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/messages/react/${messageId}`, {
        emoji,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/messages/read/${userId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
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
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const acceptMessageRequest = createAsyncThunk(
  "chat/acceptMessageRequest",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/messages/requests/accept/${userId}`,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

// Inside your chatSlice.js
export const addConnection = createAsyncThunk(
  "chat/addConnection",
  async (targetUserId, thunkAPI) => {
    try {
      // Sends the target user's ID in the request body
      const response = await axiosInstance.post("/auth/connect", {
        targetUserId,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const blockMessageRequest = createAsyncThunk(
  "chat/blockMessageRequest",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/messages/requests/block/${userId}`);
      return res.data;
    } catch (error) {
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
  messageRequests: [],
  isUsersLoading: false,
  isMessagesLoading: false,
  isRequestsLoading: false,
  isTyping: false,
  replyingTo: null,
  forwardingMessage: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = [];
    },
    addIncomingMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setReplyingTo: (state, action) => {
      state.replyingTo = action.payload;
    },
    setForwardingMessage: (state, action) => {
      state.forwardingMessage = action.payload;
    },
    setIsTyping: (state, action) => {
      state.isTyping = action.payload;
    },

    removeFromSidebar: (state, action) => {
      state.users = state.users.filter((u) => u._id !== action.payload);
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
        state.messages.push(action.payload);
      })

      .addCase(editMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(
          (m) => m._id === action.payload._id,
        );
        if (index !== -1) state.messages[index] = action.payload;
      })

      .addCase(deleteMessageForMe.fulfilled, (state, action) => {
        state.messages = state.messages.filter(
          (m) => m._id !== action.payload._id,
        );
      })

      .addCase(unsendMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(
          (m) => m._id === action.payload._id,
        );
        if (index !== -1) state.messages[index] = action.payload;
      })

      .addCase(forwardMessage.fulfilled, (state) => {
        state.forwardingMessage = null;
      })

      .addCase(reactToMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(
          (m) => m._id === action.payload._id,
        );
        if (index !== -1) state.messages[index] = action.payload;
      })

      .addCase(getMessageRequests.pending, (state) => {
        state.isRequestsLoading = true;
      })
      .addCase(getMessageRequests.fulfilled, (state, action) => {
        state.messageRequests = action.payload;
        state.isRequestsLoading = false;
      })
      .addCase(getMessageRequests.rejected, (state) => {
        state.isRequestsLoading = false;
      })

      .addCase(acceptMessageRequest.fulfilled, (state, action) => {
        state.messageRequests = state.messageRequests.filter(
          (u) => u._id !== action.payload._id,
        );
        state.users.push(action.payload);
      })

      .addCase(blockMessageRequest.fulfilled, (state, action) => {
        state.messageRequests = state.messageRequests.filter(
          (u) => u._id !== action.payload._id,
        );
      });
  },
});

export const {
  setSelectedUser,
  addIncomingMessage,
  setReplyingTo,
  setForwardingMessage,
  setIsTyping,
  removeFromSidebar,
} = chatSlice.actions;

export default chatSlice.reducer;
