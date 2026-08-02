import { useState, useEffect } from "react";

const PAYMENT_METHODS = ["card", "cash", "bank transfer", "other"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function ExpenseForm({ categories, initial, onSubmit, onCancel }) {
  const [amount, setAmount] = useState(initial?.amount ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [note, setNote] = useState(initial?.note ?? "");
  const [paymentMethod, setPaymentMethod] = useState(initial?.paymentMethod ?? "card");
  const [isRecurring, setIsRecurring] = useState(initial?.isRecurring ?? false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!categoryId && categories[0]) setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  const submit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return setError("Enter a valid amount.");
    if (!categoryId) return setError("Choose a category.");

    setError("");
    setSaving(true);
    try {
      await onSubmit({ amount: numAmount, categoryId, date, note, paymentMethod, isRecurring });
    } catch (err) {
      setError(err.message || "Couldn't save this expense.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="fadeup rounded-2xl p-5 bg-surface border border-border mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted block mb-1.5">AMOUNT</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="focus-ring w-full px-4 py-2.5 rounded-lg text-sm bg-bg text-text border border-border font-mono"
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1.5">CATEGORY</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="focus-ring w-full px-4 py-2.5 rounded-lg text-sm bg-bg text-text border border-border"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted block mb-1.5">DATE</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="focus-ring w-full px-4 py-2.5 rounded-lg text-sm bg-bg text-text border border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1.5">PAYMENT METHOD</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="focus-ring w-full px-4 py-2.5 rounded-lg text-sm bg-bg text-text border border-border"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="text-xs text-muted block mb-1.5">NOTE (optional)</label>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Groceries at Trader Joe's"
        className="focus-ring w-full mb-4 px-4 py-2.5 rounded-lg text-sm bg-bg text-text border border-border"
      />

      <label className="flex items-center gap-2 mb-5 cursor-pointer">
        <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="focus-ring" />
        <span className="text-sm text-text">Recurring monthly expense</span>
      </label>

      {error && <div className="text-sm mb-4 text-danger">{error}</div>}

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="focus-ring flex-1 py-2.5 rounded-xl font-semibold bg-mint text-bg disabled:opacity-60">
          {saving ? "Saving…" : initial ? "Save changes" : "Add expense"}
        </button>
        <button type="button" onClick={onCancel} className="focus-ring px-4 py-2.5 rounded-xl text-sm border border-border text-text">
          Cancel
        </button>
      </div>
    </form>
  );
}
