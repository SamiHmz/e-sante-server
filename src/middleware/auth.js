const jwt = require("jsonwebtoken");

// envirment variable
require("dotenv/config");
const jwtKey = process.env.JWT_KEY;

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied , not token provided");

  try {
    const decoded = jwt.verify(token, jwtKey);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).send("Invalid token");
  }
};
