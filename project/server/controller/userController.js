const { Op } = require("sequelize")
const db = require("../models")

module.exports = {
  getAllUser: async (req, res) => {
    try {
      const findAllUsers = await db.User.findAll({
        where: {
          ...req.query,
          // gunanya untuk memasukan apa yang dikita masukan di query

          username: {
            [Op.like]: `%${req.query.username || ""}%`,
          },
        },
        // attributes: {
        //   exclude: ["id", "username"],
        // },
      })
      //   ini User adalah nama model bukan nama tabel
      //   const findAllUsers = await db.User.findByPk(1);

      res.status(200).json({
        message: "Find all users",
        data: findAllUsers,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  getAllUserById: async (req, res) => {
    try {
      const { id } = req.params
      const findUserById = await db.User.findByPk(id, {
        include: [{ model: db.Expense }],
      })

      return res.status(200).json({
        message: "Find user by ID",
        data: findUserById,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  createUser: async (req, res) => {
    try {
      await db.User.create({ ...req.body })
      return res.status(201).json({
        message: "Created User",
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.params
      const findUser = await db.User.findByPk(id)

      if (!findUser) {
        return res.status(400).json({
          message: "User with ID not found",
        })
      }

      await db.User.update(req.body, {
        where: {
          // where disini dari query sql kita
          id: id,
        },
      })

      return res.status(200).json({
        message: "user Updated",
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params
      await db.User.destroy({
        where: {
          id: id,
        },
      })

      return res.status(200).json({
        message: "User deleted",
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  registerUser: async (req, res) => {
    try {
      const { email, username, password, passwordConfirm } = req.body

      if (password.length < 8) {
        return res.status(400).json({
          message: "Password need more than 8 character",
        })
      }

      if (password !== passwordConfirm) {
        return res.status(400).json({
          message: "Password does not match",
        })
      }

      const findUserByUsernameOrEmail = await db.User.findOne({
        where: {
          [Op.or]: [{ username: username }, { email: email }],
        },
      })

      if (findUserByUsernameOrEmail) {
        return res.status(400).json({
          message: " Username or email has been taken",
        })
      }

      await db.User.create({
        username,
        email,
        password,
      })

      return res.status(201).json({
        message: "User registered",
      })
    } catch (error) {
      console.log(error)
    }
  },
}
