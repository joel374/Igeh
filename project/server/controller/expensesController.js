const { Op } = require("sequelize")
const db = require("../models")

const expensesController = {
  postExpense: async (req, res) => {
    try {
      await db.Expense.create({ ...req.body })
      return res.status(201).json({
        message: "Created Expense",
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        message: "Fail to post",
      })
    }
  },
  editExpense: async (req, res) => {
    try {
      const { id } = req.params
      const findExpense = await db.Expense.findByPk(id)

      if (!findExpense) {
        return res.status(400).json({
          message: "Expense with ID not found",
        })
      }

      await db.Expense.update(req.body, {
        where: {
          id: id,
        },
      })

      return res.status(200).json({
        message: "Expense Updated",
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  deleteExpense: async (req, res) => {
    try {
      const { id } = req.params
      await db.Expense.destroy({
        where: {
          id: id,
        },
      })

      return res.status(200).json({
        message: "Expense deleted",
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  createExpense: async (req, res) => {
    try {
      const findUserById = await db.User.findByPk(req.user.id)
      if (findUserById.is_verified == "0") {
        return res.status(401).json({
          message: "User is not verified",
        })
      }
      const { amount, CategoryId, userId } = req.body

      const today = new Date()

      await db.Expense.create({
        amount,
        CategoryId: CategoryId,
        UserId: req.user.id,
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
      })

      return res.status(201).json({
        message: "Created expense",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  getTotalExpense: async (req, res) => {
    try {
      const { group, fromDate, toDate } = req.query

      if (group === "category") {
        const getTotalExpensesByCategory = await db.Expense.findAll({
          attributes: [
            [db.sequelize.fn("sum", db.sequelize.col("amount")), "sum_amount"],
            "Category.category_name",
          ],
          include: [{ model: db.Category }],
          group: "categoryId",
        })
        return res.status(200).json({
          message: "Get total expenses by category",
          data: getTotalExpensesByCategory,
        })
      }

      if (group === "day" || group === "month" || group === "year") {
        const getTotalExpensesByTimePeriod = await db.Expense.findAll({
          attributes: [
            [db.sequelize.fn("sum", db.sequelize.col("amount")), "sum_amount"],
            group,
          ],
          group,
        })

        return res.status(200).json({
          message: "Get total expenses by " + group,
          data: getTotalExpensesByTimePeriod,
        })
      }

      if (!group && fromDate && toDate) {
        const getTotalExpensesByDateRange = await db.Expense.findAll({
          where: {
            createdAt: {
              [Op.between]: [fromDate, toDate],
            },
          },
          attributes: [
            [db.sequelize.fn("sum", db.sequelize.col("amount")), "sum_amount"],
          ],
        })

        return res.status(200).json({
          message: "Get total expenses by date range",
          data: getTotalExpensesByDateRange,
        })
      }

      return res.status(400).json({
        message: "Missing group, fromDate, or toDate parameters",
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  loginUser: async (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body

      const findUserByUsernameOrEmail = await db.User.findOne({
        where: {
          [Op.or]: {
            username: usernameOrEmail,
            email: usernameOrEmail,
          },
        },
      })

      if (!findUserByUsernameOrEmail) {
        return res.status(400).json({
          message: "Username or email not found",
        })
      }

      if (findUserByUsernameOrEmail.is_suspended) {
        return res.status(400).json({
          message: "Failed to login, your account is suspended",
        })
      }

      if (findUserByUsernameOrEmail.password !== password) {
        // findUserByUsernameOrEmail.login_attempts += 1
        // findUserByUsernameOrEmail.save()

        if (findUserByUsernameOrEmail.login_attempts > 2) {
          findUserByUsernameOrEmail.is_suspended = true
          findUserByUsernameOrEmail.save()

          return res.status(400).json({
            message: "Wrong password, your account has been suspended",
          })
        }

        await db.User.increment("login_attempts", {
          where: {
            [Op.or]: {
              username: usernameOrEmail,
              email: usernameOrEmail,
            },
          },
        })

        return res.status(400).json({
          message: "Wrong password",
        })
      }

      delete findUserByUsernameOrEmail.dataValues.password

      findUserByUsernameOrEmail.login_attempts = 0
      findUserByUsernameOrEmail.save()

      return res.status(200).json({
        message: "Login successful",
        data: findUserByUsernameOrEmail,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  getExpenseByUserLogin: async (req, res) => {
    try {
      const findAllExpenses = await db.Expense.findAll({
        where: {
          UserId: req.user.id,
        },
      })
      return res.status(200).json({
        message: "Find All Expenese",
        data: findAllExpenses,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
}

module.exports = expensesController
