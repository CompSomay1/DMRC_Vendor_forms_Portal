import { Outlet, useNavigate, useLocation } from "react-router";

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/";
  const isRegister = location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center shadow-md"
        style={{ backgroundColor: "#1d4ed8", height: "72px", paddingLeft: "48px", paddingRight: "48px" }}
      >
        {/* Logo area */}
        <div
          className="flex items-center justify-center rounded-xl mr-4 shrink-0 cursor-pointer"
          style={{
            width: "46px",
            height: "46px",
            backgroundColor: "rgba(255,255,255,0.18)",
            border: "1.5px solid rgba(255,255,255,0.35)",
          }}
          onClick={() => navigate("/")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
            <line x1="12" y1="12" x2="12" y2="16" />
            <line x1="10" y1="14" x2="14" y2="14" />
          </svg>
        </div>

        {/* Site title */}
        <span
          className="text-white tracking-wide select-none cursor-pointer"
          onClick={() => navigate("/")}
          style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "0.04em" }}
        >
          Vendor Portal
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Nav links */}
        <nav className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-lg text-white transition"
            style={{
              fontSize: "0.9rem",
              fontWeight: 500,
              backgroundColor: isLogin ? "rgba(255,255,255,0.2)" : "transparent",
              border: isLogin ? "1px solid rgba(255,255,255,0.35)" : "1px solid transparent",
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 rounded-lg text-white transition"
            style={{
              fontSize: "0.9rem",
              fontWeight: 500,
              backgroundColor: isRegister ? "rgba(255,255,255,0.2)" : "transparent",
              border: isRegister ? "1px solid rgba(255,255,255,0.35)" : "1px solid transparent",
            }}
          >
            Register
          </button>
        </nav>
      </header>

      {/* Page content */}
      <main className="flex flex-1 flex-col" style={{ paddingTop: "72px" }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="py-5 text-center border-t border-gray-100 bg-white"
        style={{ fontSize: "0.8rem", color: "#9ca3af" }}
      >
        &copy; {new Date().getFullYear()} Vendor Portal. All rights reserved.
      </footer>
    </div>
  );
}
