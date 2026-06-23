import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  deletePost,
  getAllComments,
  getAllPosts,
  likePost,
  postComment,
} from "../../action/postAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
  likingPostIds: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state, action) => {
      state.postId = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        (state.isLoading = true), (state.message = "Fetching posts...");
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.posts;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts = [action.payload.post, ...state.posts];
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post._id !== action.meta.arg.postId
        );
      })
      .addCase(likePost.pending, (state, action) => {
        const postId = action.meta.arg.postId;
        if (!state.likingPostIds.includes(postId)) {
          state.likingPostIds.push(postId);
        }
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.likingPostIds = state.likingPostIds.filter(
          (id) => id !== action.payload.postId
        );
        state.posts = state.posts.map((post) =>
          post._id === action.payload.postId
            ? {
                ...post,
                likes: action.payload.likesCount,
                likedByCurrentUser: action.payload.likedByCurrentUser,
              }
            : post
        );
      })
      .addCase(likePost.rejected, (state, action) => {
        state.likingPostIds = state.likingPostIds.filter(
          (id) => id !== action.meta.arg.postId
        );
        state.message = action.payload;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.postId = action.payload.postId;
        state.comments = action.payload.comments;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.comments = [action.payload.newComment, ...state.comments];
      });
  },
});
export const { resetPostId } = postSlice.actions;

export default postSlice.reducer;
