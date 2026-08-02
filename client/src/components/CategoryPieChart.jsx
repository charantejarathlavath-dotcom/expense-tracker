import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function formatCurrency(n) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CategoryPieChart({ data }) {
  if (!data.length) {
    return (
      <div className="rounded-2xl p-5 bg-surface border border-border h-full flex items-center justify-center text-sm text-muted">
        No expenses this month yet
      </div>
    );
  }

  return (
    <div className="fadeup rounded-2xl p-5 bg-surface border border-border">
      <div className="text-sm font-medium text-text mb-4">Spend by category</div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.categoryId} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#1A2129", border: "1px solid #2A323C", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "#EDEFF2" }}
              formatter={(value, name) => [formatCurrency(value), name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
        {data.map((c) => (
          <div key={c.categoryId} className="flex items-center gap-1.5 text-xs text-muted">
            <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
            {c.icon} {c.name}
          </div>
        ))}
      </div>
    </div>
  );
}
