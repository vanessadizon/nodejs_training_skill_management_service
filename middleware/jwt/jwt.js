const JWT = require("jsonwebtoken");
const logger = require("../logging/logger").getLogger("system");

const createToken = (user) => {
  return new Promise((resolve, reject) => {
    JWT.sign({ email: user[0].aws_email }, process.env.SECRET_TOKEN_KEY, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        logger.error("jwt error:", err);
        return reject(err);
      }
      resolve(token);
    });
  });
};

const validateToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(401).json({ error_message: "Unauthorized" });
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  JWT.verify(token, process.env.SECRET_TOKEN_KEY, (err, payload) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error_message: "Unauthorized" });
      } else {
        return res.status(401).json({ error_message: err.message });
      }
    }
    req.payload = payload;
    next();
  });
};

module.exports = { createToken, validateToken };
