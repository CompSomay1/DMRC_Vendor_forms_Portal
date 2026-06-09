import { useNavigate } from "react-router";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 items-center justify-center py-24 text-center">
      <div>
        <p className="text-gray-300" style={{ fontSize: "5rem", fontWeight: 700 }}>404</p>
        <p className="text-gray-600 mt-2" style={{ fontSize: "1.1rem" }}>Page not found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2.5 rounded-lg text-white transition hover:opacity-90"
          style={{ backgroundColor: "#1d4ed8", fontSize: "0.9rem", fontWeight: 600 }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
