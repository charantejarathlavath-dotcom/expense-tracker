import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

function formatCurrency(n) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function shortDate(d) {
  const [, m, day] = d.split("-");
  return `${m}/${day}`;
}

export default function SpendOverTimeChart({ data }) {
  if (!data.length) {
    return (
      <div className="rounded-2xl p-5 bg-surface border border-border h-full flex items-center justify-center text-sm text-muted">
        No daily activity yet
      </div>
    );
  }

  return (
    <div className="fadeup rounded-2xl p-5 bg-surface border border-border">
      <div className="text-sm font-medium text-text mb-4">Spend over time</div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A323C" vertical={false} />
            <XAxis dataKey="date" tickFormatter={shortDate} stroke="#8B95A1" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#8B95A1" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ background: "#1A2129", border: "1px solid #2A323C", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "#EDEFF2" }}
              labelFormatter={shortDate}
              formatter={(value) => [formatCurrency(value), "Spent"]}
            />
            <Bar dataKey="total" fill="#34D399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
