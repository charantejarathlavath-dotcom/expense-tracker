const express = require("express");
const db = require("../db");
const { generateId } = require("../utils/id");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

const PALETTE = ["#34D399", "#60A5FA", "#A78BFA", "#FBBF24", "#F472B6", "#2DD4BF", "#FB923C", "#F87171"];

router.get("/", (req, res) => {
  const categories = db.get("categories").filter({ userId: req.userId }).value();
  res.json(categories);
});

router.post("/", (req, res) => {
  const { name, color, icon } = req.body || {};
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name is required" });
  }

  const existingCount = db.get("categories").filter({ userId: req.userId }).size().value();
  const category = {
    id: generateId(),
    userId: req.userId,
    name: name.trim(),
    color: color || PALETTE[existingCount % PALETTE.length],
    icon: icon || "🏷️",
  };
  db.get("categories").push(category).write();
  res.status(201).json(category);
});

router.delete("/:id", (req, res) => {
  const category = db.get("categories").find({ id: req.params.id, userId: req.userId }).value();
  if (!category) return res.status(404).json({ error: "category not found" });

  const inUse = db.get("expenses").filter({ userId: req.userId, categoryId: req.params.id }).size().value() > 0;
  if (inUse) return res.status(409).json({ error: "category has expenses attached; reassign or delete them first" });

  db.get("categories").remove({ id: req.params.id, userId: req.userId }).write();
  db.get("budgets").remove({ categoryId: req.params.id, userId: req.userId }).write();
  res.status(204).end();
});

module.exports = router;
