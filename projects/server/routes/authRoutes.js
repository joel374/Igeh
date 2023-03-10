const express = require("express");
const authController = require("../controller/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { body } = require("express-validator");
const { upload } = require("../lib/uploader");

const router = express.Router();

router.post(
  "/register",
  // body("username", "Invalid username").isLength({ min: 3 }).isAlphanumeric(),
  // body("email").isEmail(),
  // body("password").isStrongPassword({
  //   minLength: 8,
  //   minNumbers: 1,
  //   minSymbols: 1,
  //   minUppercase: 1,
  //   minLowercase: 1,
  // }),
  authController.registerUser
);
router.post("/login", authController.loginUser);
router.get("/refresh-token", verifyToken, authController.refreshToken);

router.patch(
  "/me",
  verifyToken,
  upload({
    acceptedFileTypes: ["png ", "jpg", "jpeg"],
    filePrefix: "PROF",
  }).single("profile_picture"),
  authController.editUserProfile
);

router.get("/verification", authController.verifyUser);

// buat sebuah router bernama /verification dengan method post
// isi endpoint nya untuk resend verification email
// route nya membutuhkan sebuah middleware
// buat route untuk mengirim kembali verification email

router.post("/resend", verifyToken, authController.resendVerifica);
router.get("/:id", authController.getUserById);

module.exports = router;
