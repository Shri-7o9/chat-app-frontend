import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../libs/axios.js";
import toast from "react-hot-toast";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/check");
      return res.data;
    } catch (error) {
      console.log("Error in checkAuth:", error);
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  },
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
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
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      toast.success("Logged in Successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/forgetPassword", { email });
      toast.success("Password reset link sent to your email");
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "something went wrong";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,

    onlineUsers: [],
    socket: null,
    isSendingResetLink: false,
  },

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
      
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isLoggingIn = false;
      })

      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      // signup
      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })

      .addCase(signup.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isSigningUp = false;
      })

      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false;
      })

      .addCase(forgetPassword.pending, (state) => {
        state.isSendingResetLink = true;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.isSendingResetLink = false;
      })
      .addCase(forgetPassword.rejected, (state) => {
        state.isSendingResetLink = false;
      });
  },
});

export const { setSocket, setOnlineUsers, logout, clearAuthError } =
  authSlice.actions;

export default authSlice.reducer;