const express = require("express");
const db = require("../db");
const { generateId } = require("../utils/id");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/budgets?month=YYYY-MM
router.get("/", (req, res) => {
  const month = req.query.month;
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: "month query param is required, format YYYY-MM" });
  }
  const budgets = db.get("budgets").filter({ userId: req.userId, month }).value();
  res.json(budgets);
});

// PUT /api/budgets  { categoryId, month, amount }  — upsert
router.put("/", (req, res) => {
  const { categoryId, month, amount } = req.body || {};
  if (typeof categoryId !== "string" || !categoryId) return res.status(400).json({ error: "categoryId is required" });
  if (typeof month !== "string" || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: "month is required, format YYYY-MM" });
  }
  if (typeof amount !== "number" || amount < 0) return res.status(400).json({ error: "amount must be a non-negative number" });

  const category = db.get("categories").find({ id: categoryId, userId: req.userId }).value();
  if (!category) return res.status(400).json({ error: "unknown categoryId" });

  const existing = db.get("budgets").find({ userId: req.userId, categoryId, month }).value();
  if (existing) {
    db.get("budgets").find({ userId: req.userId, categoryId, month }).assign({ amount }).write();
    return res.json({ ...existing, amount });
  }

  const budget = { id: generateId(), userId: req.userId, categoryId, month, amount };
  db.get("budgets").push(budget).write();
  res.status(201).json(budget);
});

module.exports = router;
