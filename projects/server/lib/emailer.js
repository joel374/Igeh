const nodemailer = require("nodemailer")
const dotenv = require("dotenv")

dotenv.config()

const emailer = async ({ to, subject, text, html }) => {
  if (!to) {
    throw new Error("Emailer needs recipient email. `to` parameter is missing")
  }

  // const testAccount = await nodemailer.createTestAccount()
  // untuk membuat email temporary
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS,
    },
    // secure: false,
    // port: 587,
  })
  // untk mengirimkan isi dari email nya

  await transporter.sendMail({
    to: to, // penerima email
    subject: subject, // seubhject email
    text: text, // body email dalam bentuk text
    html: html, // body email dalam bentuk html
  })
}

module.exports = emailer
