import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await clientServer.get("/posts", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    const { file, body } = userData;

    try {

      const formData = new FormData();
      formData.append("body", body);
      if (file) formData.append("media", file);

      const response = await clientServer.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ token in header
        },
      });

      return thunkAPI.fulfillWithValue(response.data); // ✅ return created post object
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Post not uploaded"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deleted",
  async ({ postId }, thunkAPI) => {
    try {
      const response = await clientServer.delete("/delete_post", {
        data: {
          postId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong!!!");
    }
  }
);

export const likePost = createAsyncThunk(
  "post/liked",
  async ({ token, postId }, thunkAPI) => {
    try {
      const response = await clientServer.post("/like_post", {
        token,
        postId,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong!!"
      );
    }
  }
);

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/get_comments_by_post?post_id=${postData.postId}`
      );

      return thunkAPI.fulfillWithValue({
        comments: response.data.comments,
        postId: postData.postId,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong!!");
    }
  }
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/comment_post",
        {
          postId: commentData.postId,
          commentBody: commentData.body,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong!");
    }
  }
);
