import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, name);
      navigate("/");
    } catch (err) {
      setError(err.message || "Couldn't create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-bg flex items-center justify-center px-6">
      <form onSubmit={submit} className="fadeup w-full max-w-sm">
        <div className="font-display text-2xl font-bold text-text mb-1">💸 Expense Tracker</div>
        <div className="text-sm text-muted mb-8">Create your account</div>

        <label className="text-xs text-muted block mb-1.5">NAME</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Optional"
          className="focus-ring w-full mb-4 px-4 py-3 rounded-lg text-sm bg-surface text-text border border-border"
        />

        <label className="text-xs text-muted block mb-1.5">EMAIL</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="focus-ring w-full mb-4 px-4 py-3 rounded-lg text-sm bg-surface text-text border border-border"
        />

        <label className="text-xs text-muted block mb-1.5">PASSWORD</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="focus-ring w-full mb-6 px-4 py-3 rounded-lg text-sm bg-surface text-text border border-border"
        />

        {error && <div className="text-sm mb-4 text-danger">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring w-full py-3 rounded-xl font-semibold bg-mint text-bg disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <div className="text-sm text-muted mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-mint">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
