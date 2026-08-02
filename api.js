import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/expenses", label: "Expenses", icon: "🧾" },
  { to: "/budgets", label: "Budgets", icon: "🎯" },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-bg flex">
      <aside className="w-60 shrink-0 border-r border-border p-5 hidden md:flex md:flex-col">
        <div className="mb-8">
          <div className="font-display text-lg font-bold text-text">💸 Expense Tracker</div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `focus-ring flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-surface text-text" : "text-muted hover:text-text hover:bg-surface"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-4 border-t border-border">
          <div className="text-xs text-muted mb-2 truncate">{user?.email}</div>
          <button onClick={logout} className="focus-ring text-sm text-muted hover:text-danger transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-bg border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="font-display font-bold text-text">💸 Expense Tracker</div>
        <button onClick={logout} className="focus-ring text-xs text-muted">
          Sign out
        </button>
      </div>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-surface border-t border-border flex justify-around py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `focus-ring flex flex-col items-center text-xs gap-1 px-3 py-1 ${isActive ? "text-mint" : "text-muted"}`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 pt-16 pb-20 md:pt-0 md:pb-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-5 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
