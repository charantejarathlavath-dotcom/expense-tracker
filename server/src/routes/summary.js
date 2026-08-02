const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

function prevMonth(month) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 2, 1)); // m is 1-indexed; -2 -> previous month, 0-indexed
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function sum(expenses) {
  return expenses.reduce((acc, e) => acc + e.amount, 0);
}

// GET /api/summary?month=YYYY-MM
router.get("/", (req, res) => {
  const month = req.query.month;
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: "month query param is required, format YYYY-MM" });
  }

  const allExpenses = db.get("expenses").filter({ userId: req.userId }).value();
  const categories = db.get("categories").filter({ userId: req.userId }).value();
  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));

  const thisMonthExpenses = allExpenses.filter((e) => e.date.startsWith(month));
  const previousMonth = prevMonth(month);
  const prevMonthExpenses = allExpenses.filter((e) => e.date.startsWith(previousMonth));

  const total = sum(thisMonthExpenses);
  const prevTotal = sum(prevMonthExpenses);
  const changePct = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : null;

  const byCategoryMap = {};
  thisMonthExpenses.forEach((e) => {
    byCategoryMap[e.categoryId] = (byCategoryMap[e.categoryId] || 0) + e.amount;
  });
  const byCategory = Object.entries(byCategoryMap)
    .map(([categoryId, catTotal]) => ({
      categoryId,
      name: categoryById[categoryId]?.name || "Unknown",
      color: categoryById[categoryId]?.color || "#8B95A1",
      icon: categoryById[categoryId]?.icon || "🏷️",
      total: catTotal,
    }))
    .sort((a, b) => b.total - a.total);

  const overTimeMap = {};
  thisMonthExpenses.forEach((e) => {
    overTimeMap[e.date] = (overTimeMap[e.date] || 0) + e.amount;
  });
  const overTime = Object.entries(overTimeMap)
    .map(([date, dayTotal]) => ({ date, total: dayTotal }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const recent = [...thisMonthExpenses]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 8)
    .map((e) => ({
      ...e,
      categoryName: categoryById[e.categoryId]?.name || "Unknown",
      categoryColor: categoryById[e.categoryId]?.color || "#8B95A1",
      categoryIcon: categoryById[e.categoryId]?.icon || "🏷️",
    }));

  res.json({ month, total, prevTotal, changePct, byCategory, overTime, recent });
});

module.exports = router;
