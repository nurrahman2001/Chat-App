const jwt = require("jsonwebtoken");
const JWT_SECRET = "12345678901234567890";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "Access Denied" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No Token Provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid Token" });
    req.user = decoded;
    next();
  });
};

module.exports = { authenticateToken };
