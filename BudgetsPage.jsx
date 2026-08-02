function formatCurrency(n) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function SummaryCards({ total, prevTotal, changePct, topCategory }) {
  const isUp = changePct !== null && changePct > 0;
  const isDown = changePct !== null && changePct < 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="fadeup rounded-2xl p-5 bg-surface border border-border">
        <div className="text-xs text-muted mb-2">This month</div>
        <div className="font-mono text-3xl font-bold text-text">{formatCurrency(total)}</div>
        {changePct !== null ? (
          <div className={`text-xs mt-2 ${isUp ? "text-danger" : isDown ? "text-mint" : "text-muted"}`}>
            {isUp ? "▲" : isDown ? "▼" : "—"} {Math.abs(changePct).toFixed(1)}% vs last month
          </div>
        ) : (
          <div className="text-xs mt-2 text-muted">No data last month</div>
        )}
      </div>

      <div className="fadeup rounded-2xl p-5 bg-surface border border-border">
        <div className="text-xs text-muted mb-2">Last month</div>
        <div className="font-mono text-3xl font-bold text-text">{formatCurrency(prevTotal)}</div>
        <div className="text-xs mt-2 text-muted">for comparison</div>
      </div>

      <div className="fadeup rounded-2xl p-5 bg-surface border border-border">
        <div className="text-xs text-muted mb-2">Top category</div>
        {topCategory ? (
          <>
            <div className="text-xl font-semibold text-text flex items-center gap-2">
              <span>{topCategory.icon}</span> {topCategory.name}
            </div>
            <div className="text-xs mt-2 font-mono" style={{ color: topCategory.color }}>
              {formatCurrency(topCategory.total)}
            </div>
          </>
        ) : (
          <div className="text-sm text-muted mt-1">No expenses yet</div>
        )}
      </div>
    </div>
  );
}
