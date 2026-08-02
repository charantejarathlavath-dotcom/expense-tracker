const express = require("express");
const db = require("../db");
const { generateId } = require("../utils/id");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

function validateExpenseBody(body, { partial = false } = {}) {
  const errors = [];
  if (!partial || body.amount !== undefined) {
    if (typeof body.amount !== "number" || !isFinite(body.amount) || body.amount <= 0) {
      errors.push("amount must be a positive number");
    }
  }
  if (!partial || body.categoryId !== undefined) {
    if (typeof body.categoryId !== "string" || !body.categoryId) errors.push("categoryId is required");
  }
  if (!partial || body.date !== undefined) {
    if (typeof body.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
      errors.push("date must be in YYYY-MM-DD format");
    }
  }
  return errors;
}

// GET /api/expenses?from=YYYY-MM-DD&to=YYYY-MM-DD&categoryId=...&q=...
router.get("/", (req, res) => {
  const { from, to, categoryId, q, paymentMethod } = req.query;

  let results = db.get("expenses").filter({ userId: req.userId }).value();

  if (from) results = results.filter((e) => e.date >= from);
  if (to) results = results.filter((e) => e.date <= to);
  if (categoryId) results = results.filter((e) => e.categoryId === categoryId);
  if (paymentMethod) results = results.filter((e) => e.paymentMethod === paymentMethod);
  if (q) {
    const needle = q.toLowerCase();
    results = results.filter((e) => (e.note || "").toLowerCase().includes(needle));
  }

  results = [...results].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt));
  res.json(results);
});

router.post("/", (req, res) => {
  const body = req.body || {};
  const errors = validateExpenseBody(body);
  if (errors.length) return res.status(400).json({ error: errors.join("; ") });

  const category = db.get("categories").find({ id: body.categoryId, userId: req.userId }).value();
  if (!category) return res.status(400).json({ error: "unknown categoryId" });

  const expense = {
    id: generateId(),
    userId: req.userId,
    amount: body.amount,
    categoryId: body.categoryId,
    date: body.date,
    note: (body.note || "").trim(),
    paymentMethod: body.paymentMethod || "card",
    isRecurring: Boolean(body.isRecurring),
    recurringInterval: body.isRecurring ? body.recurringInterval || "monthly" : null,
    createdAt: Date.now(),
  };
  db.get("expenses").push(expense).write();
  res.status(201).json(expense);
});

router.put("/:id", (req, res) => {
  const existing = db.get("expenses").find({ id: req.params.id, userId: req.userId }).value();
  if (!existing) return res.status(404).json({ error: "expense not found" });

  const body = req.body || {};
  const errors = validateExpenseBody(body, { partial: true });
  if (errors.length) return res.status(400).json({ error: errors.join("; ") });

  if (body.categoryId) {
    const category = db.get("categories").find({ id: body.categoryId, userId: req.userId }).value();
    if (!category) return res.status(400).json({ error: "unknown categoryId" });
  }

  const updated = {
    ...existing,
    ...("amount" in body ? { amount: body.amount } : {}),
    ...("categoryId" in body ? { categoryId: body.categoryId } : {}),
    ...("date" in body ? { date: body.date } : {}),
    ...("note" in body ? { note: (body.note || "").trim() } : {}),
    ...("paymentMethod" in body ? { paymentMethod: body.paymentMethod } : {}),
    ...("isRecurring" in body ? { isRecurring: Boolean(body.isRecurring) } : {}),
    ...("recurringInterval" in body ? { recurringInterval: body.recurringInterval } : {}),
  };
  db.get("expenses").find({ id: req.params.id, userId: req.userId }).assign(updated).write();
  res.json(updated);
});

router.delete("/:id", (req, res) => {
  const existing = db.get("expenses").find({ id: req.params.id, userId: req.userId }).value();
  if (!existing) return res.status(404).json({ error: "expense not found" });

  db.get("expenses").remove({ id: req.params.id, userId: req.userId }).write();
  res.status(204).end();
});

module.exports = router;
