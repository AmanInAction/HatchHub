import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import {
  createPost,
  getAllComments,
  getAllPosts,
  likePost,
  postComment,
} from "@/config/redux/action/postAction";
import { resetPostId } from "@/config/redux/reducer/postReducer";
import UserLayout from "@/layouts/UserLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Dashboard() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }

    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere, authState.all_profiles_fetched, dispatch]);

  const handleUpload = async () => {
    if (!postContent.trim() && !fileContent) return;

    await dispatch(
      createPost({ file: fileContent, body: postContent.trim() })
    ).unwrap();
    setFileContent(null);
    setPostContent("");
  };

  const handleLike = async (postId, alreadyLiked, isPending) => {
    if (alreadyLiked || isPending) return;

    await dispatch(
      likePost({
        token: localStorage.getItem("token"),
        postId,
      })
    );
  };

  const activeCommentThread =
    postState.postId !== ""
      ? postState.posts.find((post) => post._id === postState.postId)
      : null;

  if (!authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.placeholderState}>Loading your workspace...</div>
        </DashboardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.wrapper}>
          <section className={styles.hero}>
            <div>
              <p className={styles.heroEyebrow}>Your network feed</p>
              <h1>Share thoughtful updates and keep the signal high.</h1>
              <p className={styles.heroText}>
                HatchHub now keeps likes trustworthy and the layout calmer, so
                conversations feel more credible and easier to scan.
              </p>
            </div>
            <div className={styles.heroStatCard}>
              <span>Posts loaded</span>
              <strong>{postState.posts.length}</strong>
              <p>Fresh updates from your community, arranged for easy reading.</p>
            </div>
          </section>

          <section className={styles.composeCard}>
            <div className={styles.composeHeader}>
              <img
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${authState.user.userId.profilePicture}`}
                alt={authState.user.userId.name}
                className={styles.userProfile}
              />
              <div className={styles.composeIntro}>
                <div>
                  <p className={styles.composeTitle}>Create a post</p>
                  <p className={styles.composeSubtitle}>
                    Share a useful update, idea, or milestone with your network.
                  </p>
                </div>
                <div className={styles.composeQuickStat}>
                  <span>Visible now</span>
                  <strong>{postState.posts.length}</strong>
                </div>
              </div>
            </div>

            <div className={styles.composeRow}>
              <textarea
                className={styles.textAreaOfContent}
                placeholder="What would you like your network to know today?"
                onChange={(e) => setPostContent(e.target.value)}
                value={postContent}
              />

              <div className={styles.composeActions}>
                <label htmlFor="fileUpload" className={styles.attachButton}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <span>{fileContent ? fileContent.name : "Add an image"}</span>
                </label>
                <input
                  onChange={(e) => setFileContent(e.target.files?.[0] || null)}
                  type="file"
                  accept="image/*"
                  hidden
                  id="fileUpload"
                />
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!postContent.trim() && !fileContent}
                  className={styles.uploadButton}
                >
                  Publish
                </button>
              </div>
            </div>
          </section>

          <div className={styles.feedGrid}>
            <section className={styles.postsContainer}>
              {postState.posts.map((post) => {
                const likePending = postState.likingPostIds.includes(post._id);

                return (
                  <article key={post._id} className={styles.postCard}>
                    <div className={styles.postHeader}>
                      <div className={styles.postIdentity}>
                        <img
                          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${post.userID.profilePicture}`}
                          alt={post.userID.name}
                        />
                        <div>
                          <div className={styles.postMetaRow}>
                            <p className={styles.postAuthor}>{post.userID.name}</p>
                            <span className={styles.postHandle}>
                              @{post.userID.username}
                            </span>
                          </div>
                          <p className={styles.postDate}>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {post.body && <p className={styles.postBody}>{post.body}</p>}

                    {post.media !== "" && (
                      <div className={styles.mediaFrame}>
                        <img
                          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/${post.media}`}
                          alt="Post media"
                        />
                      </div>
                    )}

                    <div className={styles.optionsContainer}>
                      <button
                        type="button"
                        onClick={() =>
                          handleLike(
                            post._id,
                            post.likedByCurrentUser,
                            likePending
                          )
                        }
                        className={`${styles.optionButton} ${
                          post.likedByCurrentUser ? styles.optionButtonActive : ""
                        }`}
                        disabled={post.likedByCurrentUser || likePending}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                          />
                        </svg>
                        <span>
                          {post.likes} {post.likes === 1 ? "Like" : "Likes"}
                        </span>
                      </button>

                      <button
                        type="button"
                        className={styles.optionButton}
                        onClick={() => {
                          const text = encodeURIComponent(post.body || "");
                          const url = encodeURIComponent("https://hatchhub.vercel.app");
                          const twitterURL = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                          window.open(twitterURL, "_blank");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                          />
                        </svg>
                        <span>Share</span>
                      </button>

                      <button
                        type="button"
                        className={styles.optionButton}
                        onClick={() => {
                          setCommentText("");
                          dispatch(getAllComments({ postId: post._id }));
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                          />
                        </svg>
                        <span>Comments</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        </div>

        {postState.postId !== "" && (
          <div
            onClick={() => {
              dispatch(resetPostId(""));
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allCommentsContainer}
            >
              <div className={styles.commentModalHeader}>
                <div>
                  <p className={styles.modalEyebrow}>Conversation</p>
                  <h2>{activeCommentThread?.userID?.name || "Comments"}</h2>
                </div>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={() => dispatch(resetPostId(""))}
                >
                  Close
                </button>
              </div>

              <div className={styles.commentsList}>
                {postState.comments.length === 0 && (
                  <p className={styles.emptyComments}>No comments yet.</p>
                )}

                {postState.comments.map((postComment) => (
                  <div className={styles.singleComment} key={postComment._id}>
                    <div className={styles.singleComment_profileContainer}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${postComment.userID.profilePicture}`}
                        alt={postComment.userID.name}
                      />
                      <div>
                        <p className={styles.commentAuthor}>
                          {postComment.userID.name}
                        </p>
                        <p className={styles.commentHandle}>
                          @{postComment.userID.username}
                        </p>
                      </div>
                    </div>
                    <p className={styles.commentBody}>{postComment.body}</p>
                  </div>
                ))}
              </div>

              <div className={styles.postCommentContainer}>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a thoughtful comment"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!commentText.trim()) return;
                    await dispatch(
                      postComment({
                        postId: postState.postId,
                        body: commentText.trim(),
                      })
                    );
                    setCommentText("");
                    await dispatch(getAllComments({ postId: postState.postId }));
                  }}
                  className={styles.postCommentContainer_btn}
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}

export default Dashboard;
