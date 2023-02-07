const express = require("express");
const commentController = require("../controller/commentController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create/:PostId", verifyToken, commentController.create);
router.patch("/update/:id", verifyToken, commentController.update);

module.exports = router;
