import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import AdminNavbar from "../components/AdminNavbar";

function AdminDashboard() {
  const [stats, setStats] = useState({
    lost: 0,
    found: 0,
    matches: 0,
    claims: 0,
    handovers: 0,
    pending: 0,
    approved: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [lost, found, matches, claims, handovers] = await Promise.all([
        API.get("/lost-items"),
        API.get("/found-items"),
        API.get("/matches"),
        API.get("/claims"),
        API.get("/handovers"),
      ]);

      const lostItems = lost.data || [];
      const foundItems = found.data || [];

      setStats({
        lost: lostItems.length,
        found: foundItems.length,
        matches: matches.data?.length || 0,
        claims: claims.data?.length || 0,
        handovers: handovers.data?.length || 0,
        pending:
          lostItems.filter((i) => i.status === "PENDING_APPROVAL").length +
          foundItems.filter((i) => i.status === "PENDING_APPROVAL").length,
        approved:
          lostItems.filter((i) => i.status === "ACTIVE").length +
          foundItems.filter((i) => i.status === "ACTIVE").length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const actions = [
    { title: "Manage Lost Items", icon: "📦", path: "/admin/lost-items" },
    { title: "Manage Found Items", icon: "📚", path: "/admin/found-items" },
    { title: "Review Matches", icon: "🔗", path: "/admin/matches" },
    { title: "Manage Claims", icon: "📝", path: "/admin/claims" },
    { title: "Manage Handovers", icon: "📅", path: "/admin/handovers" },
    { title: "Audit Logs", icon: "📜", path: "/audit-logs" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-xl border border-purple-100 p-10 mb-10">
          <p className="uppercase text-purple-600 font-semibold tracking-widest text-sm">
            Welcome Back
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mt-2">
            Admin
          </h1>

          <h1 className="text-5xl md:text-6xl font-extrabold text-purple-700">
            Control Center
          </h1>

          <p className="text-slate-600 text-lg mt-4 max-w-2xl">
            Manage reports, claims, matches, handovers, and portal activity.
          </p>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5 mb-10">
          <StatCard title="Lost" value={stats.lost} icon="📦" color="bg-purple-100 text-purple-700" />
          <StatCard title="Found" value={stats.found} icon="📚" color="bg-blue-100 text-blue-700" />
          <StatCard title="Matches" value={stats.matches} icon="🔗" color="bg-green-100 text-green-700" />
          <StatCard title="Claims" value={stats.claims} icon="📝" color="bg-pink-100 text-pink-700" />
          <StatCard title="Handovers" value={stats.handovers} icon="📅" color="bg-indigo-100 text-indigo-700" />
          <StatCard title="Pending" value={stats.pending} icon="⏳" color="bg-yellow-100 text-yellow-700" />
          <StatCard title="Approved" value={stats.approved} icon="✅" color="bg-emerald-100 text-emerald-700" />
        </div>

        <h2 className="text-3xl font-bold text-purple-700 mb-6">
          Quick Actions
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action) => (
            <Link
              key={action.title}
              to={action.path}
              className="bg-white border border-purple-100 rounded-3xl p-6 shadow-md hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-1 transition-all"
            >
              <div className="text-5xl mb-4">{action.icon}</div>
              <h3 className="text-xl font-bold text-slate-900">{action.title}</h3>
              <p className="text-slate-500 mt-2">Click to manage this section.</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white border border-purple-100 rounded-2xl shadow-md p-5 hover:shadow-xl transition">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>

      <p className="text-slate-500 mt-3">{title}</p>

      <h2 className="text-3xl font-bold text-slate-900 mt-1">{value}</h2>
    </div>
  );
}

export default AdminDashboard;