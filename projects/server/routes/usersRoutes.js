const express = require("express")
const userController = require("../controller/userController")

const router = express.Router()

router.get("/", userController.getAllUser)
router.get("/:id", userController.getAllUserById)
router.post("/", userController.createUser)
router.patch("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)
router.post("/registers", userController.registerUser)

module.exports = router
