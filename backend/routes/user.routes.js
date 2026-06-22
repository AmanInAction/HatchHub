import { Router } from "express";
import multer from "multer";
import {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  sendConnectionRequest,
  respondToConnectionRequest,
  getMyConnections,
  MyConnectionRequests,
  getUserProfileAndUserBasedOnUsername,
} from "../controllers/user.controller.js";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

router
  .route("/update_profile_picture")
  .post(upload.single("profilePicture"), uploadProfilePicture);

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/get_all_users").get(getAllUserProfile);
router.route("/download_resume").get(downloadProfile);
router.route("/send_connection_request").post(sendConnectionRequest);
router.route("/get_connection_request").get(getMyConnections);
router.route("/accept_connection_request").post(respondToConnectionRequest);
router.route("/my_connection_requests").get(MyConnectionRequests);
router
  .route("/get_profile_based_on_username")
  .get(getUserProfileAndUserBasedOnUsername);

export default router;
