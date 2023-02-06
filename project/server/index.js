const express = require("express")
const dotenv = require("dotenv")
const db = require("./models")
const cors = require("cors")
const fs = require("fs")

dotenv.config()

const PORT = 2000

const app = express()
app.use(cors())
app.use(express.json())

const emailer = require("./lib/emailer")
const handlebars = require("handlebars")

app.post("/email", async (req, res) => {
  // baca email mentah
  const rawHTML = fs.readFileSync("templates/register_user.html", "utf-8")
  // compile supaya bisa dipake handlebars
  const compiledHTML = handlebars.compile(rawHTML)
  // isi variable2 yang ada di HTML
  const result = compiledHTML({
    username: "anto",
  })
  await emailer({
    to: "joellegifanimanisali@gmail.com",
    html: result,
    subject: "Test email",
    text: "Halo Dunia",
  })

  res.send("Email Sent")
})

const expensesRoute = require("./routes/expensesRoutes")
const usersRoutes = require("./routes/usersRoutes")
const authRoutes = require("./routes/authRoutes")
const postsRoutes = require("./routes/postsRoutes")
const transactionsRoute = require("./routes/transactionsRoute")

const { verifyToken } = require("./middlewares/authMiddleware")

// import express from "express";
// import dotenv from "dotenv";
// import db from "./models/index.js";

app.use("/expenses", verifyToken, expensesRoute)
app.use("/users", usersRoutes)
app.use("/auth", authRoutes)
app.use("/posts", postsRoutes)
app.use("/public", express.static("public"))

// buat route namanya transaction
app.use("/transactions", verifyToken, transactionsRoute)

// app.get("/users", async (req, res) => {
//   try {
//     const findAllUsers = await db.User.findAll({
//       where: {
//         ...req.query,
//         // gunanya untuk memasukan apa yang dikita masukan di query

//         username: {
//           [Op.like]: `%${req.query.username || ""}%`,
//         },
//       },
//       // attributes: {
//       //   exclude: ["id", "username"],
//       // },
//     })
//     //   ini User adalah nama model bukan nama tabel
//     //   const findAllUsers = await db.User.findByPk(1);

//     res.status(200).json({
//       message: "Find all users",
//       data: findAllUsers,
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       message: "Server Error",
//     })
//   }
// })

// app.get("/users/:id", async (req, res) => {
//   try {
//     const { id } = req.params
//     const findUserById = await db.User.findByPk(id, {
//       include: [{ model: db.Expense }],
//     })

//     return res.status(200).json({
//       message: "Find user by ID",
//       data: findUserById,
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       message: "Server Error",
//     })
//   }
// })

// app.post("/users", async (req, res) => {
//   try {
//     await db.User.create({ ...req.body })
//     return res.status(201).json({
//       message: "Created User",
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       message: "Server Error",
//     })
//   }
// })

// app.patch("/users/:id", async (req, res) => {
//   try {
//     const { id } = req.params
//     const findUser = await db.User.findByPk(id)

//     if (!findUser) {
//       return res.status(400).json({
//         message: "User with ID not found",
//       })
//     }

//     await db.User.update(req.body, {
//       where: {
//         // where disini dari query sql kita
//         id: id,
//       },
//     })

//     return res.status(200).json({
//       message: "user Updated",
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       message: "Server Error",
//     })
//   }
// })

// app.delete("/users/:id", async (req, res) => {
//   try {
//     const { id } = req.params
//     await db.User.destroy({
//       where: {
//         id: id,
//       },
//     })

//     return res.status(200).json({
//       message: "User deleted",
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       message: "Server Error",
//     })
//   }
// })

// app.post("/users/registers", async (req, res) => {
//   try {
//     const { email, username, password, passwordConfirm } = req.body

//     if (password.length < 8) {
//       return res.status(400).json({
//         message: "Password need more than 8 character",
//       })
//     }

//     if (password !== passwordConfirm) {
//       return res.status(400).json({
//         message: "Password does not match",
//       })
//     }

//     const findUserByUsernameOrEmail = await db.User.findOne({
//       where: {
//         [Op.or]: [{ username: username }, { email: email }],
//       },
//     })

//     if (findUserByUsernameOrEmail) {
//       return res.status(400).json({
//         message: " Username or email has been taken",
//       })
//     }

//     await db.User.create({
//       username,
//       email,
//       password,
//     })

//     return res.status(201).json({
//       message: "User registered",
//     })
//   } catch (error) {
//     console.log(error)
//   }
// })

const axios = require("axios")
const redisClient = require("./lib/redis")

app.get("/dogs/:breed", async (req, res) => {
  try {
    const { breed } = req.params
    const cacheResult = await redisClient.get(breed)

    if (cacheResult) {
      return res.status(200).json({
        message: "Fetch dogs API",
        data: JSON.parse(cacheResult),
      })
    }

    const response = await axios.get(
      `https://dog.ceo/api/breed/${breed}/images`
    )

    await redisClient.setEx(breed, 600, JSON.stringify(response.data))

    return res.status(200).json({
      message: "Fetch dogs API",
      data: response.data,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Server error",
    })
  }
})

redisClient.on("error", (err) => {
  console.log(err)
})

app.listen(PORT, async () => {
  db.sequelize.sync({ alter: true })

  if (!fs.existsSync("public")) {
    fs.mkdirSync("public")
  }

  // await redisClient.connect()

  console.log("Listening in Port", PORT)
})
