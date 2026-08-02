import { useEffect, useState, useCallback, useMemo } from "react";
import { getExpenses, createExpense, updateExpense, deleteExpense, getCategories, createCategory } from "../lib/api";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseList from "../components/ExpenseList.jsx";

export default function ExpensesPage() {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [filters, setFilters] = useState({ from: "", to: "", categoryId: "", q: "" });

  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  const categoryById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);

  const loadCategories = useCallback(async () => {
    const cats = await getCategories();
    setCategories(cats);
  }, []);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getExpenses(filters);
      setExpenses(data);
    } catch (e) {
      setError(e.message || "Couldn't load expenses.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleCreate = async (payload) => {
    await createExpense(payload);
    setShowForm(false);
    loadExpenses();
  };

  const handleUpdate = async (payload) => {
    await updateExpense(editing.id, payload);
    setEditing(null);
    loadExpenses();
  };

  const handleDelete = async (expense) => {
    if (!confirm(`Delete this ${expense.amount} expense?`)) return;
    await deleteExpense(expense.id);
    loadExpenses();
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    await createCategory({ name: newCategoryName.trim() });
    setNewCategoryName("");
    setShowNewCategory(false);
    loadCategories();
  };

  return (
    <div className="fadeup">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-text">Expenses</h1>
        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="focus-ring px-4 py-2 rounded-xl text-sm font-semibold bg-mint text-bg"
          >
            + Add expense
          </button>
        )}
      </div>

      {showForm && (
        <ExpenseForm categories={categories} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}
      {editing && (
        <ExpenseForm categories={categories} initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
      )}

      {/* Filters */}
      <div className="rounded-2xl p-4 bg-surface border border-border mb-5 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-muted block mb-1">FROM</label>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
            className="focus-ring px-3 py-2 rounded-lg text-sm bg-bg text-text border border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">TO</label>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
            className="focus-ring px-3 py-2 rounded-lg text-sm bg-bg text-text border border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">CATEGORY</label>
          <select
            value={filters.categoryId}
            onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value }))}
            className="focus-ring px-3 py-2 rounded-lg text-sm bg-bg text-text border border-border"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs text-muted block mb-1">SEARCH NOTES</label>
          <input
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            placeholder="e.g. coffee"
            className="focus-ring w-full px-3 py-2 rounded-lg text-sm bg-bg text-text border border-border"
          />
        </div>

        {showNewCategory ? (
          <div className="flex items-end gap-2">
            <div>
              <label className="text-xs text-muted block mb-1">NEW CATEGORY</label>
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Travel"
                className="focus-ring px-3 py-2 rounded-lg text-sm bg-bg text-text border border-border"
              />
            </div>
            <button onClick={handleAddCategory} className="focus-ring px-3 py-2 rounded-lg text-sm bg-mint text-bg">
              Add
            </button>
          </div>
        ) : (
          <button onClick={() => setShowNewCategory(true)} className="focus-ring text-sm text-muted hover:text-text">
            + New category
          </button>
        )}
      </div>

      {error && <div className="text-sm mb-4 text-danger">{error}</div>}
      {loading ? (
        <div className="text-sm text-muted">Loading…</div>
      ) : (
        <ExpenseList expenses={expenses} categoryById={categoryById} onEdit={setEditing} onDelete={handleDelete} />
      )}
    </div>
  );
}
