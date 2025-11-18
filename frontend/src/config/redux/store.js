/**
 * Steps for state managemerent using Redux:
 * 1. Submit Action
 * 2. Handle actions in it's reducer
 * 3. Register here -> reducer
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer/index.js";
import postReducer from "./reducer/postReducer/index.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
  },
});
