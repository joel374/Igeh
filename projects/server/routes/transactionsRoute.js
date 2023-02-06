const express = require("express")
const transactionsController = require("../controller/transactionsController")
const { upload } = require("../lib/uploader")
const { verifyToken } = require("../middlewares/authMiddleware")
const router = express.Router()

router.post(
  "/",
  upload({
    acceptedFileTypes: ["png", "jpeg", "jpg", "pdf"],
    filePrefix: "TRANSACTIONS",
  }).single("post_image"),
  transactionsController.createTransaction
)

router.patch("/status/:id", transactionsController.waitingPayment)
module.exports = router
