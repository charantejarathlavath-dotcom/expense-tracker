function formatCurrency(n) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ExpenseList({ expenses, categoryById, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl p-8 bg-surface border border-border text-center text-sm text-muted">
        No expenses match your filters yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden">
      <div className="flex flex-col divide-y divide-border">
        {expenses.map((e) => {
          const cat = categoryById[e.categoryId];
          return (
            <div key={e.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-surface2 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0"
                  style={{ background: `${cat?.color || "#8B95A1"}22` }}
                >
                  {cat?.icon || "🏷️"}
                </span>
                <div className="min-w-0">
                  <div className="text-sm text-text truncate">{e.note || cat?.name || "Expense"}</div>
                  <div className="text-xs text-muted">
                    {cat?.name || "Unknown"} · {e.date} · {e.paymentMethod}
                    {e.isRecurring ? " · recurring" : ""}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-3">
                <div className="font-mono text-sm text-text">{formatCurrency(e.amount)}</div>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(e)} className="focus-ring text-xs text-muted hover:text-text">
                    Edit
                  </button>
                  <button onClick={() => onDelete(e)} className="focus-ring text-xs text-muted hover:text-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
