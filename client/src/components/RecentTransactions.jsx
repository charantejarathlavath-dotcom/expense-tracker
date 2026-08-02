function formatCurrency(n) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function RecentTransactions({ items }) {
  return (
    <div className="fadeup rounded-2xl p-5 bg-surface border border-border">
      <div className="text-sm font-medium text-text mb-4">Recent transactions</div>
      {items.length === 0 ? (
        <div className="text-sm text-muted">Nothing logged yet this month.</div>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {items.map((e) => (
            <div key={e.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                  style={{ background: `${e.categoryColor}22` }}
                >
                  {e.categoryIcon}
                </span>
                <div className="min-w-0">
                  <div className="text-sm text-text truncate">{e.note || e.categoryName}</div>
                  <div className="text-xs text-muted">
                    {e.categoryName} · {e.date}
                  </div>
                </div>
              </div>
              <div className="font-mono text-sm text-text shrink-0 ml-3">{formatCurrency(e.amount)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
