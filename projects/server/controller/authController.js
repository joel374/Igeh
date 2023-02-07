const { Op } = require("sequelize");
const db = require("../models");
const bcrypt = require("bcrypt");
const { signToken } = require("../lib/jwt");
const { validationResult } = require("express-validator");
const emailer = require("../lib/emailer");
const handlebars = require("handlebars");
const fs = require("fs");
const {
  validateVerificationToken,
  createVerificationToken,
} = require("../lib/verification");

const User = db.User;

const authController = {
  registerUser: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          mesagge: "Invalid fields",
        });
      }

      const { username, email, password } = req.body;

      const findUserByUsernameOrEmail = await User.findOne({
        where: {
          [Op.or]: {
            username,
            email,
          },
        },
      });

      if (findUserByUsernameOrEmail) {
        return res.status(400).json({
          message: "Username or email has been used",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      const verificationToken = createVerificationToken({
        id: newUser.id,
      });

      const verificationLink = `http://localhost:2000/auth/verification?verification_token=${verificationToken}`;

      const rawHTML = fs.readFileSync("templates/register_user.html", "utf-8");
      const compiledHTML = handlebars.compile(rawHTML);
      const result = compiledHTML({
        username,
        verificationLink,
      });

      await emailer({
        to: email,
        html: result,
        subject: "Test email",
        text: "Halo Dunia",
      });

      // res.send("Email Sent")

      return res.status(200).json({
        mesagge: "Register Succes",
        data: newUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body;

      const findUserByUsernameOrEmail = await User.findOne({
        where: {
          [Op.or]: {
            username: usernameOrEmail,
            email: usernameOrEmail,
          },
        },
      });

      if (!findUserByUsernameOrEmail) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const passwordValid = bcrypt.compareSync(
        password,
        findUserByUsernameOrEmail.password
      );

      if (!passwordValid) {
        return res.status(400).json({
          mesagge: "Password invalid",
        });
      }

      delete findUserByUsernameOrEmail.dataValues.password;

      const token = signToken({
        id: findUserByUsernameOrEmail.id,
      });

      return res.status(201).json({
        message: "Login user",
        data: findUserByUsernameOrEmail,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  refreshToken: async (req, res) => {
    try {
      const findUserById = await User.findByPk(req.user.id);

      const renewedToken = signToken({
        id: req.user.id,
      });

      return res.status(200).json({
        mesagge: "Renewed user token",
        data: findUserById,
        token: renewedToken,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        mesagge: "Server error",
      });
    }
  },
  editUserProfile: async (req, res) => {
    try {
      if (req.file) {
        req.body.profile_picture_url = `http://locahost:2000/public/${req.file.filename}`;
      }

      // profil_picture akan dikirim ke localhost kita

      const findUserByUsernameOrEmail = await User.findOne({
        where: {
          [Op.or]: {
            username: req.body.username || "",
            email: req.body.email || "",
          },
        },
      });

      // flow : mencari username dan password nya dulu apakah sudah digunakan atau belum

      if (findUserByUsernameOrEmail) {
        return res.status(400).json({
          mesagge: "Username or Email has been used",
        });
      }

      // kalau sudah akan muncul error seperti di atas

      await User.update(
        { ...req.body },
        {
          where: {
            id: req.user.id,
          },
        }
      );

      const findUserById = await User.findByPk(req.user.id);

      return res.status(200).json({
        message: "Expense Updated",
        data: findUserById,
      });
    } catch (error) {
      console.log(500);
      return res.status(500).json({
        mesagge: "Server Error",
      });
    }
  },
  verifyUser: async (req, res) => {
    try {
      const { verification_token } = req.query;

      const validToken = validateVerificationToken(verification_token);

      if (!validToken) {
        return res.status(401).json({
          mesagge: "Token invalid",
        });
      }

      await User.update(
        { is_verified: true },
        {
          where: {
            id: validToken.id,
          },
        }
      );

      return res.redirect("http://localhost:3000/login");
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        mesagge: "Server error",
      });
    }
  },
  resendVerifica: async (req, res) => {
    try {
      const findUserById = await User.findByPk(req.user.id);

      const verificationToken = createVerificationToken({
        id: req.user.id,
      });

      const verificationLink = `http://localhost:2000/auth/verification?verification_token=${verificationToken}`;

      const rawHTML = fs.readFileSync("templates/register_user.html", "utf-8");
      const compiledHTML = handlebars.compile(rawHTML);
      const result = compiledHTML({
        username: findUserById.username,
        verificationLink,
      });

      await emailer({
        to: findUserById.email,
        html: result,
        subject: "Test email",
        text: "Halo Dunia",
      });
      return res.status(200).json({
        mesagge: "Email sent",
      });
    } catch (error) {
      console.log(error);
    }
  },
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const findUserById = await db.User.findByPk(id);

      return res.status(200).json({
        message: "Find user by ID",
        data: findUserById,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
};

module.exports = authController;
