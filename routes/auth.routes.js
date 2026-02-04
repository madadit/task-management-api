const express = require("express")
const router = express.Router()

router.post("/login", (req, res) => {
  const { email, password } = req.body

  if (email === "admin@mail.com" && password === "password123") {
    return res.json({ token: "secret-token-123" })
  }

  res.status(401).json({ message: "Invalid credentials" })
})

module.exports = router
