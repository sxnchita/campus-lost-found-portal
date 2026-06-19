import { Link, useNavigate, useLocation } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const active = (path) =>
    location.pathname === path
      ? "bg-purple-600 text-white shadow-md"
      : "text-slate-700 hover:bg-purple-100 hover:text-purple-700";

  return (
    <nav className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-extrabold text-purple-700">
          🛡️ Admin Portal
        </h1>

        <div className="flex flex-wrap justify-center gap-2">
          <Link
            to="/admin-dashboard"
            className={`px-4 py-2 rounded-xl transition ${active("/admin-dashboard")}`}
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/admin/lost-items"
            className={`px-4 py-2 rounded-xl transition ${active("/admin/lost-items")}`}
          >
            📦 Lost
          </Link>

          <Link
            to="/admin/found-items"
            className={`px-4 py-2 rounded-xl transition ${active("/admin/found-items")}`}
          >
            📚 Found
          </Link>

          <Link
            to="/admin/matches"
            className={`px-4 py-2 rounded-xl transition ${active("/admin/matches")}`}
          >
            🔗 Matches
          </Link>

          <Link
            to="/admin/claims"
            className={`px-4 py-2 rounded-xl transition ${active("/admin/claims")}`}
          >
            📝 Claims
          </Link>

          <Link
            to="/admin/handovers"
            className={`px-4 py-2 rounded-xl transition ${active("/admin/handovers")}`}
          >
            📅 Handovers
          </Link>

          <Link
            to="/audit-logs"
            className={`px-4 py-2 rounded-xl transition ${active("/audit-logs")}`}
          >
            📜 Audit Logs
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;