const jwt = require("jsonwebtoken");
require("dotenv/config");

const isAuthenticated = async (req, res, next) => {
  // const token = req.header("Authorization");
  const token = req.headers.authorization;
  console.log(req.headers);
  if (!token) return res.status(400).json({ message: "Token not found" });
  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(payload);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({
      errMessage: "The site was unable to authenticate that request, please login before proceeding.",
    });
  }
};

module.exports = {
  isAuthenticated,
};
