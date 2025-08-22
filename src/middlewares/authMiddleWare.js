require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);
    const id = decoded.id;

    if (!id) {
      return res.status(400).json({ error: "Invalid token payload" });
    }

    req.user = { id, role: decoded.role}; 
    next(); 
  } catch (err) {
    return res.status(500).json({ error: err.message});
  }
}

module.exports = authMiddleware;
