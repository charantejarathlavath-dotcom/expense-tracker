import { useState } from "react";

function formatCurrency(n) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function BudgetRow({ category, spent, budgetAmount, onSave }) {
  const [value, setValue] = useState(budgetAmount ?? "");
  const [saving, setSaving] = useState(false);

  const pct = budgetAmount > 0 ? Math.min(100, Math.round((spent / budgetAmount) * 100)) : 0;
  const over = budgetAmount > 0 && spent > budgetAmount;
  const near = !over && budgetAmount > 0 && spent / budgetAmount >= 0.8;
  const barColor = over ? "#F87171" : near ? "#FBBF24" : category.color;

  const save = async () => {
    const amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) return;
    setSaving(true);
    try {
      await onSave(amount);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fadeup rounded-2xl p-4 bg-surface border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-text">
          <span>{category.icon}</span>
          {category.name}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">$</span>
          <input
            type="number"
            min="0"
            step="1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            placeholder="No budget set"
            className="focus-ring w-24 px-2 py-1 rounded-md text-sm bg-bg text-text border border-border font-mono text-right"
          />
        </div>
      </div>

      {budgetAmount > 0 ? (
        <>
          <div className="h-2 rounded-full w-full overflow-hidden bg-[#0F1419] mb-1.5">
            <div className="bar-fill h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
          </div>
          <div className="flex justify-between text-xs">
            <span className={over ? "text-danger" : near ? "text-warn" : "text-muted"}>
              {formatCurrency(spent)} of {formatCurrency(budgetAmount)}
            </span>
            <span className="text-muted">{pct}%</span>
          </div>
        </>
      ) : (
        <div className="text-xs text-muted">{formatCurrency(spent)} spent · set a budget to track progress</div>
      )}
      {saving && <div className="text-[10px] text-muted mt-1">Saving…</div>}
    </div>
  );
}
