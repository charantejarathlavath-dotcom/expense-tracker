import { useEffect, useState, useCallback } from "react";
import { getCategories, getBudgets, setBudget, getSummary } from "../lib/api";
import BudgetRow from "../components/BudgetRow.jsx";

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}
function shiftMonth(month, delta) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(month) {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(undefined, { month: "long", year: "numeric", timeZone: "UTC" });
}

export default function BudgetsPage() {
  const [month, setMonth] = useState(currentMonth());
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [spentByCategory, setSpentByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [cats, bud, summary] = await Promise.all([getCategories(), getBudgets(month), getSummary(month)]);
      setCategories(cats);
      setBudgets(bud);
      setSpentByCategory(Object.fromEntries(summary.byCategory.map((c) => [c.categoryId, c.total])));
    } catch (e) {
      setError(e.message || "Couldn't load budgets.");
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    load();
  }, [load]);

  const budgetByCategory = Object.fromEntries(budgets.map((b) => [b.categoryId, b.amount]));

  const handleSave = async (categoryId, amount) => {
    await setBudget({ categoryId, month, amount });
    load();
  };

  const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0);
  const totalSpent = Object.values(spentByCategory).reduce((acc, v) => acc + v, 0);

  return (
    <div className="fadeup">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-text">Budgets</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setMonth((m) => shiftMonth(m, -1))} className="focus-ring px-2.5 py-1.5 rounded-lg text-sm border border-border text-text">
            ←
          </button>
          <div className="text-sm text-muted w-36 text-center">{monthLabel(month)}</div>
          <button onClick={() => setMonth((m) => shiftMonth(m, 1))} className="focus-ring px-2.5 py-1.5 rounded-lg text-sm border border-border text-text">
            →
          </button>
        </div>
      </div>

      {totalBudget > 0 && (
        <div className="rounded-2xl p-4 bg-surface border border-border mb-5 text-sm text-muted">
          Total budgeted: <span className="text-text font-mono">${totalBudget.toLocaleString()}</span> · Total spent:{" "}
          <span className={totalSpent > totalBudget ? "text-danger" : "text-text"}>${totalSpent.toLocaleString()}</span>
        </div>
      )}

      {error && <div className="text-sm mb-4 text-danger">{error}</div>}
      {loading ? (
        <div className="text-sm text-muted">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((c) => (
            <BudgetRow
              key={c.id}
              category={c}
              spent={spentByCategory[c.id] || 0}
              budgetAmount={budgetByCategory[c.id] || 0}
              onSave={(amount) => handleSave(c.id, amount)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
