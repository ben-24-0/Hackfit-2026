import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Register from "./pages/RegisterPage";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminRegistrations from "./pages/Admin/Registration";
import RegistrationDetail from "./pages/Admin/RegistrationDetail";

import { useSmoothScroll } from "./hooks/useSmoothScroll";

const UNICORN_SDK_URL =
  "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js";

export default function App() {
  const [isLoading, setIsLoading] = useState(() => {
    // Check if this is a fresh visit (not a page refresh or navigation)
    const hasVisited = sessionStorage.getItem("hackfit-visited");
    return !hasVisited;
  });

  // Initialize smooth scrolling
  useSmoothScroll();

  // Warm up UnicornStudio assets as early as possible (during splash)
  useEffect(() => {
    // Preconnect to speed up TLS handshakes
    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = "https://cdn.jsdelivr.net";
    preconnect.crossOrigin = "anonymous";
    document.head.appendChild(preconnect);

    // Preload the SDK script
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "script";
    preload.href = UNICORN_SDK_URL;
    preload.crossOrigin = "anonymous";
    document.head.appendChild(preload);

    // Trigger early chunk download for the React wrapper
    import("unicornstudio-react").catch(() => {
      /* ignore prefetch errors */
    });

    return () => {
      document.head.removeChild(preconnect);
      document.head.removeChild(preload);
    };
  }, []);

  useEffect(() => {
    // Mark as visited for this session
    sessionStorage.setItem("hackfit-visited", "true");
  }, []);

  if (isLoading) {
    return <LoadingScreen onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />


        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/registrations" element={<AdminRegistrations />} />
        <Route path="/admin/registrations/:id" element={<RegistrationDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
