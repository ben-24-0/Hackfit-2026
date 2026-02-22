// src/pages/Admin/Registrations.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ← added here
import { api } from "../../lib/api";

// Updated type with optional fields based on your real DB data
type Registration = {
  _id: string;
  teamSize: number;
  teamName?: string;
  lead?: {
    name: string;
    gender?: string;
    institution: string;
    semester?: string;
    division?: string;
    department?: string;
    email: string;
    contact: string;
    foodPreference?: string;
    residentialStatus?: string;
    teamName?: string;
  };
  members: Array<Record<string, any>>;
  payment?: {
    contact: string;
    screenshotUrl: string;
  };
  totalAmount?: number;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminRegistrations() {
  const [data, setData] = useState<{
    totalTeams: number;
    currentPage: number;
    data: Registration[];
  } | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // ← added here (inside the component)

  const limit = 10;
  const apiKey = sessionStorage.getItem("admin-api-key") || "";

  const fetchRegistrations = async () => {
    if (!apiKey) {
      setError("No API key found. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.getRegistrations({
        page,
        limit,
        search,
        apiKey,
      });
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load registrations");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [page, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (!apiKey) {
    return (
      <div style={{ padding: "6rem 2rem", textAlign: "center", color: "#d1d5db" }}>
        Please log in as admin first.
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Top section with contrast */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "2rem",
          backdropFilter: "blur(8px)",
        }}
      >
        <h1 style={{ margin: 0, color: "#f3f4f6", fontSize: "2rem" }}>
          Admin Panel – Registrations
        </h1>

        <div
          style={{
            marginTop: "1rem",
            fontSize: "1.2rem",
            fontWeight: 500,
            color: "#e5e7eb",
          }}
        >
          <strong>Total teams registered:</strong>{" "}
          {data ? data.totalTeams : "Loading..."}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Search by team name..."
          value={search}
          onChange={handleSearch}
          style={{
            padding: "12px 16px",
            width: "320px",
            maxWidth: "100%",
            border: "1px solid #4b5563",
            borderRadius: "8px",
            fontSize: "1rem",
            backgroundColor: "#1f2937",
            color: "#f3f4f6",
            outline: "none",
          }}
        />
      </div>

      {error && (
        <div
          style={{
            background: "#7f1d1d",
            color: "#fecaca",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "1.5rem",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "8rem 0",
            color: "#9ca3af",
            fontSize: "1.1rem",
          }}
        >
          Loading registrations...
        </div>
      ) : (
        <>
          <div style={{ overflowX: "auto", borderRadius: "12px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 8px",
                minWidth: "900px",
                backgroundColor: "#111827",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#1f2937",
                    color: "#d1d5db",
                    fontWeight: 600,
                  }}
                >
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      borderRadius: "12px 0 0 12px",
                    }}
                  >
                    Team Name
                  </th>
                  <th style={{ padding: "16px 20px", textAlign: "left" }}>College</th>
                  <th style={{ padding: "16px 20px", textAlign: "center" }}>Size</th>
                  <th style={{ padding: "16px 20px", textAlign: "center" }}>Amount</th>
                  <th style={{ padding: "16px 20px", textAlign: "left" }}>Lead Contact</th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "center",
                      borderRadius: "0 12px 12px 0",
                    }}
                  >
                    Payment SS
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        padding: "5rem 1rem",
                        color: "#9ca3af",
                        fontStyle: "italic",
                        background: "#1f2937",
                        borderRadius: "12px",
                      }}
                    >
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  data?.data?.map((reg) => (
                    <tr
                      key={reg._id}
                      style={{
                        background: "#1f2937",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                        transition: "background 0.2s",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/admin/registrations/${reg._id}`)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#374151")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#1f2937")}
                    >
                      <td
                        style={{
                          padding: "16px 20px",
                          borderRadius: "12px 0 0 12px",
                          color: "#f3f4f6",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "220px",
                        }}
                      >
                        {reg.lead?.teamName || reg.teamName || "—"}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          color: "#f3f4f6",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "260px",
                        }}
                      >
                        {reg.lead?.institution || "—"}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          textAlign: "center",
                          color: "#f3f4f6",
                        }}
                      >
                        {reg.teamSize ?? "—"}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          textAlign: "center",
                          color: "#f3f4f6",
                        }}
                      >
                        {reg.totalAmount ? `₹${reg.totalAmount}` : "—"}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          color: "#f3f4f6",
                        }}
                      >
                        {reg.payment?.contact || "—"}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          textAlign: "center",
                          borderRadius: "0 12px 12px 0",
                        }}
                      >
                        {reg.payment?.screenshotUrl ? (
                          <a
                            href={reg.payment.screenshotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#60a5fa",
                              fontWeight: 500,
                              textDecoration: "underline",
                            }}
                          >
                            View
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {data && data.totalTeams > 0 && (
            <div
              style={{
                marginTop: "2.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                style={{
                  padding: "10px 28px",
                  backgroundColor: page === 1 ? "#374151" : "#3b82f6",
                  color: page === 1 ? "#9ca3af" : "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  minWidth: "110px",
                }}
              >
                Previous
              </button>

              <span style={{ fontWeight: 500, color: "#d1d5db" }}>
                Page {page} of {Math.ceil(data.totalTeams / limit) || 1}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data.data.length < limit || loading}
                style={{
                  padding: "10px 28px",
                  backgroundColor:
                    data.data.length < limit ? "#374151" : "#3b82f6",
                  color: data.data.length < limit ? "#9ca3af" : "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                  cursor: data.data.length < limit ? "not-allowed" : "pointer",
                  minWidth: "110px",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}