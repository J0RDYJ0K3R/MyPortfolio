
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const match = /^Bearer\s+(\S+)$/i.exec(
    req.headers.authorization || ""
  );

  if (!match) {
    return res.status(401).json({
      message: "Authentication token required"
    });
  }

  try {
    const decoded = jwt.verify(
      match[1],
      process.env.JWT_SECRET
    );

    const userId = decoded.userId || decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token payload"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists"
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};
