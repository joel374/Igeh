const { validateToken } = require("../lib/jwt")

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization

  if (!token) {
    return res.status(401).json({
      mesagge: "User authorized",
    })
  }

  try {
    token = token.split(" ")[1]

    const verifiedUser = validateToken(token)

    if (!verifiedUser) {
      return res.status(401).json({
        mesagge: "Unauthorized request",
      })
    }

    req.user = verifiedUser

    next()
  } catch (error) {
    return res.status(400).json({
      mesagge: "Invalid Token",
    })
  }
}

module.exports = {
  verifyToken,
}
