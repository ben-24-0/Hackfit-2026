// src/components/Admin/AdminLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError("Please enter the API key");
      return;
    }

    setLoading(true);
    setError("");

    // Simple test call to verify key
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/registrations?page=1&limit=1`, {
      headers: { "x-api-key": apiKey.trim() },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid API key");
        return res.json();
      })
      .then(() => {
        // Store in memory (not persisted)
        sessionStorage.setItem("admin-api-key", apiKey.trim());
        navigate("/admin/registrations");
      })
      .catch((err) => {
        setError(err.message || "Authentication failed");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: "2rem", border: "1px solid #ddd", borderRadius: 8 }}>
      <h2>Admin Login</h2>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>Enter your admin API key</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API Key"
            style={{ width: "100%", padding: "12px", fontSize: "1rem" }}
            autoFocus
          />
        </div>

        {error && <div style={{ color: "crimson", marginBottom: "1rem" }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "#aaa" : "#0066cc",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: "1.05rem",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Verifying..." : "Login"}
        </button>
      </form>
    </div>
  );
}