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

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", {
        fullName: data.fullName,
        userName: data.userName,
      });
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

//change password

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, thunkAPI) => {
    try {

      const token = localStorage.getItem("token"); 
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axiosInstance.put(
        "/auth/change-password",
        { currentPassword, newPassword },
        config
      );

      return response.data; // Usually a success message like { message: "Password updated" }
    } catch (error) {
      // Extract custom error message from backend or use generic one
      const message = error.response?.data?.message || error.message || "Failed to change password";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data?.message);
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
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    isSendingResetLink: false,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errorMessage: "",
  },

  reducers: {

    setUser: (state, action) => {
      state.authUser = action.payload;
    },

    setSocket: (state, action) => {
      state.socket = action.payload;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

     // Reducer to reset temporary messaging/status states in components
    resetPasswordState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.errorMessage = "";
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
      //Checkout
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.authUser = action.payload.user;
        state.isCheckingAuth = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })
      
      //Login
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

      // signup
      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })

      .addCase(signup.fulfilled, (state, action) => {
        state.isSigningUp = false;
      })

      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false;
      })

      //Forget 
      .addCase(forgetPassword.pending, (state) => {
        state.isSendingResetLink = true;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.isSendingResetLink = false;
      })
      .addCase(forgetPassword.rejected, (state) => {
        state.isSendingResetLink = false;
      })

      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isUpdatingProfile = false;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      })

      // Change password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = "";
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload; // Contains the error message from rejectWithValue
      })

       // logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.authUser = null;
        state.isLoggingIn = false;
        state.socket = null;
        state.onlineUsers = [];
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoggingIn = false;
      })

  },
});

export const { setSocket, setOnlineUsers, logout, clearAuthError, resetPasswordState } =
  authSlice.actions;

export default authSlice.reducer;