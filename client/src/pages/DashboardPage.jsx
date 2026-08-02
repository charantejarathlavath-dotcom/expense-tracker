import { useEffect, useState, useCallback } from "react";
import { getSummary } from "../lib/api";
import SummaryCards from "../components/SummaryCards.jsx";
import CategoryPieChart from "../components/CategoryPieChart.jsx";
import SpendOverTimeChart from "../components/SpendOverTimeChart.jsx";
import RecentTransactions from "../components/RecentTransactions.jsx";

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

export default function DashboardPage() {
  const [month, setMonth] = useState(currentMonth());
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSummary(month);
      setSummary(data);
    } catch (e) {
      setError(e.message || "Couldn't load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="fadeup">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-text">Dashboard</h1>
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

      {error && <div className="text-sm mb-4 text-danger">{error}</div>}
      {loading && !summary && <div className="text-sm text-muted">Loading…</div>}

      {summary && (
        <>
          <SummaryCards
            total={summary.total}
            prevTotal={summary.prevTotal}
            changePct={summary.changePct}
            topCategory={summary.byCategory[0] || null}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <CategoryPieChart data={summary.byCategory} />
            <SpendOverTimeChart data={summary.overTime} />
          </div>

          <RecentTransactions items={summary.recent} />
        </>
      )}
    </div>
  );
}
