import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const links = [
    { path: "/admin-dashboard", label: "🏠 Dashboard" },
    { path: "/admin/lost-items", label: "📦 Lost" },
    { path: "/admin/found-items", label: "📚 Found" },
    { path: "/admin/matches", label: "🔗 Matches" },
    { path: "/admin/claims", label: "📝 Claims" },
    { path: "/admin/handovers", label: "📅 Handovers" },
    { path: "/audit-logs", label: "📜 Audit Logs" },
  ];

  const active = (path) =>
    location.pathname === path
      ? "bg-purple-600 text-white shadow-md"
      : "text-slate-700 hover:bg-purple-100 hover:text-purple-700";

  return (
    <nav className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-purple-700">
          🛡️ Admin Portal
        </h1>

        <div className="hidden lg:flex flex-wrap justify-center gap-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-xl transition ${active(link.path)}`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition"
          >
            🚪 Logout
          </button>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="lg:hidden bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-bold"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-extrabold text-purple-700">
                🛡️ Menu
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-2xl text-slate-500"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl font-semibold transition ${active(
                    link.path
                  )}`}
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={logout}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold transition text-left"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default AdminNavbar;