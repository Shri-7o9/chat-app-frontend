import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../libs/axios.js";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/check");
      return res.data;
    } catch (error) {
      console.log("Error in checkAuth:", error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/signup", {
        fullName: formData.fullName,
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
      });
      return res.data;
    } catch (error) {
      console.log("Error in signup:", error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      return res.data;
    } catch (error) {
      console.log("Error in login:", error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);


export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      return res.data;
    } catch (error) {
      console.log("Error in logout:", error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/forget-password", { email });
      return res.data;
    } catch (error) {
      console.log("Error in forgetPassword:", error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
        password,
      });
      return res.data;
    } catch (error) {
      console.log("Error in resetPassword:", error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

const initialState = {
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    logout: (state) => {
      state.authUser = null;
      state.socket = null;
      state.onlineUsers = [];
    },
    clearAuthError: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })

      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.authUser = action.payload.user;
        state.isSigningUp = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false;
      })

      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload.user;
        state.isLoggingIn = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.authUser = null;
        state.socket = null;
        state.onlineUsers = [];
      })
      .addCase(logoutUser.rejected, (state) => {
        state.authUser = null;
        state.socket = null;
        state.onlineUsers = [];
      });
  },
});

export const { setSocket, setOnlineUsers, logout, clearAuthError } =
  authSlice.actions;

export default authSlice.reducer;