import { Router } from "express";
import {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
  commentPost,
  get_comments_by_post,
  delete_comment_of_user,
  likePost,
} from "../controllers/posts.controller.js";
import multer from "multer";
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route("/").get(activeCheck);
router.route("/post").post(upload.single("media"), createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment_post").post(commentPost);
router.route("/get_comments_by_post").get(get_comments_by_post);
router.route("/delete_comment_of_user").delete(delete_comment_of_user);
router.route("/like_post").post(likePost);

export default router;
