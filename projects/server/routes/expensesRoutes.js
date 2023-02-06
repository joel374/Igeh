const express = require("express")
const expensesController = require("../controller/expensesController")

const router = express.Router()

// 1. ketika create expenses tidak terima userId di body otomatis dapetin ID user yang sedang login lalu masukan ke UserId di setiap expense yang dibuat
// router.post("/", expensesController.postExpense)
router.get("/total", expensesController.getTotalExpense)
router.patch("/:id", expensesController.editExpense)
router.delete("/:id", expensesController.deleteExpense)
router.post("/login", expensesController.loginUser)
router.post("/", expensesController.createExpense)

// 2. Dapetin list expenses dari user yang sedang login Jangan pake body, query, dan route params
router.get("/me", expensesController.getExpenseByUserLogin)

module.exports = router
