const jwt = require("jsonwebtoken");
const db = require("../../connection");

const checkAddress = (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.userId = decoded.id;

    // ✅ Now check user's address in DB
    const q = "SELECT default_address_id FROM user WHERE user_id = ?";
    db.query(q, [decoded.id], (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      // If no result found
      if (!result.length) {
        return res.status(404).json({ message: "User not found" });
      }

      // ✅ Check if address exists
      const user = result[0];
      if (!user.default_address_id) {
        // No address set — block or redirect
        return res.status(403).json({
          redirectTo: "/profile/add-address",
          message: "Please add an address first",
        });
      }

      // ✅ All good, continue to the next middleware/controller
    });
    next();
  });
};

module.exports = { checkAddress };
