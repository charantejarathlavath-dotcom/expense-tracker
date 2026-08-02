const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { generateId } = require("../utils/id");
const { signToken, requireAuth } = require("../middleware/auth");
const { DEFAULT_CATEGORIES } = require("../utils/defaultCategories");

const router = express.Router();

function publicUser(user) {
  return { id: user.id, email: user.email, name: user.name };
}

router.post("/register", (req, res) => {
  const { email, password, name } = req.body || {};
  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "valid email is required" });
  }
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "password must be at least 6 characters" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.get("users").find({ email: normalizedEmail }).value();
  if (existing) return res.status(409).json({ error: "an account with that email already exists" });

  const user = {
    id: generateId(),
    email: normalizedEmail,
    name: (name || "").trim() || normalizedEmail.split("@")[0],
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: Date.now(),
  };
  db.get("users").push(user).write();

  // Seed default categories for the new user.
  const categories = DEFAULT_CATEGORIES.map((c) => ({
    id: generateId(),
    userId: user.id,
    name: c.name,
    color: c.color,
    icon: c.icon,
  }));
  db.get("categories").push(...categories).write();

  const token = signToken(user.id);
  res.status(201).json({ token, user: publicUser(user) });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.get("users").find({ email: normalizedEmail }).value();
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: "invalid email or password" });
  }

  const token = signToken(user.id);
  res.json({ token, user: publicUser(user) });
});

// GET /api/auth/me — used to restore a session on page refresh from a stored token
router.get("/me", requireAuth, (req, res) => {
  const user = db.get("users").find({ id: req.userId }).value();
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json({ user: publicUser(user) });
});

module.exports = router;
