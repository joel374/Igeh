const express = require("express");
const postController = require("../controller/postController");
const { upload } = require("../lib/uploader");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  upload({
    acceptedFileTypes: ["png", "jpeg", "jpg", "pdf"],
    filePrefix: "POST",
  }).single("post_image"),
  postController.createPost
);
router.get("/", postController.getAllPosts);

router.get("/me", verifyToken, postController.getAllPostsByLogin);

router.get("/profile/:id", postController.getAllPostsById);

module.exports = router;
