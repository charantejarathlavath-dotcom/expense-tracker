const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";
const TOKEN_KEY = "expense_tracker_token";

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${SERVER_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ---- auth ----
export const register = (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) });
export const login = (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) });
export const getMe = () => request("/api/auth/me");

// ---- categories ----
export const getCategories = () => request("/api/categories");
export const createCategory = (body) => request("/api/categories", { method: "POST", body: JSON.stringify(body) });
export const deleteCategory = (id) => request(`/api/categories/${id}`, { method: "DELETE" });

// ---- expenses ----
export const getExpenses = (params = {}) => {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return request(`/api/expenses${qs ? `?${qs}` : ""}`);
};
export const createExpense = (body) => request("/api/expenses", { method: "POST", body: JSON.stringify(body) });
export const updateExpense = (id, body) => request(`/api/expenses/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteExpense = (id) => request(`/api/expenses/${id}`, { method: "DELETE" });

// ---- budgets ----
export const getBudgets = (month) => request(`/api/budgets?month=${month}`);
export const setBudget = (body) => request("/api/budgets", { method: "PUT", body: JSON.stringify(body) });

// ---- summary ----
export const getSummary = (month) => request(`/api/summary?month=${month}`);
