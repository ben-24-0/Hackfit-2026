export const api = {
  getRegistrations: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    apiKey: string;
  }) => {
    const { page = 1, limit = 10, search = "", apiKey } = params;
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    const url = `${API_BASE}/api/admin/registrations?page=${page}&limit=${limit}${
      search ? `&search=${encodeURIComponent(search)}` : ""
    }`;

    const res = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      // Keep cache enabled — 304 is good for performance
      // cache: "default" is fine (default behavior)
    });

    // ────────────────────────────────────────────────
    // Important change here
    // ────────────────────────────────────────────────
    if (res.status === 304) {
      // 304 means "use cached response body"
      // But fetch already resolved res.json() with the cached content
      // → we can just proceed to parse it normally
      console.log("[api] Using cached response (304)");
    }

    if (!res.ok && res.status !== 304) {
      let errData;
      try {
        errData = await res.json();
      } catch {}
      throw new Error(
        errData?.message || `Request failed with status ${res.status}`
      );
    }

    // This works for BOTH 200 and 304
    const data = await res.json();

    // Optional: validate shape
    if (!data || !data.success) {
      throw new Error("Invalid response format from server");
    }

    return data;
  },
};