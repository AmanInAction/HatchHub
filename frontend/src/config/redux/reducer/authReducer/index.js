import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getAboutUser,
  getAllUsers,
  getConnectionRequest,
  getMyConnectionRequests,
  acceptConnection,
} from "../../action/authAction";

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: !!token,
  message: "",
  isTokenThere: !!token,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_users: [],
  all_profiles_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "Hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },

    setTokenIsThere: (state) => {
      state.isTokenThere = true;
      state.loggedIn = true;
      state.isLoading = false;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
      state.loggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Loading...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.loggedIn = false;
        state.message = action.payload || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Loading...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.loggedIn = false;
        state.message = action.payload || "Registration failed";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.user;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload.profiles;
      })
      .addCase(getConnectionRequest.fulfilled, (state, action) => {
        state.connections = action.payload.connections || [];
      })
      .addCase(getMyConnectionRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.connectionRequest = action.payload.connections || [];
      })

      .addCase(getMyConnectionRequests.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(acceptConnection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = "Connection accepted successfully";

        // Optionally remove the accepted connection from pending list
        state.connectionRequest = state.connectionRequest.filter(
          (req) => req._id !== action.meta.arg.connectionId
        );
      })
      .addCase(acceptConnection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to accept connection";
      });
  },
});

export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere } =
  authSlice.actions;

export default authSlice.reducer;
