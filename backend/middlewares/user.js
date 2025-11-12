const jwt = require('jsonwebtoken')

const protect = async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(' ')[1]
      req.user = jwt.verify(token, process.env.JWT_SECRET)
      next()
    }
    catch (error) {
      res.status(401).json({
        message: "Invalid token",
        error: error
      })
    }

  }
  if (!token) {
    res.status(404).json({
      message: "Token not found"
    })
  }
}

module.exports = { protect }