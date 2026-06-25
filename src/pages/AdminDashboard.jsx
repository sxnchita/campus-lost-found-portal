
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import API from "../services/api";
import AdminNavbar from "../components/AdminNavbar";

function AdminDashboard() {
  const [stats, setStats] = useState({
    lost: 0, found: 0, matches: 0, claims: 0,
    handovers: 0, pending: 0, approved: 0, resolved: 0,
  });

  const [activities, setActivities] = useState([]);

 useEffect(() => {
  fetchStats();

  const interval = setInterval(() => {
    fetchStats();
  }, 30000);

  return () => clearInterval(interval);
}, []);

  const fetchStats = async () => {
    try {
      const [lost, found, matches, claims, handovers, logs] = await Promise.all([
        API.get("/lost-items"),
        API.get("/found-items"),
        API.get("/matches"),
        API.get("/claims"),
        API.get("/handovers"),
        API.get("/audit-logs/recent"),
      ]);

      const lostItems = lost.data || [];
      const foundItems = found.data || [];
      const allItems = [...lostItems, ...foundItems];

      setStats({
        lost: lostItems.length,
        found: foundItems.length,
        matches: matches.data?.length || 0,
        claims: claims.data?.length || 0,
        handovers: handovers.data?.length || 0,
        pending: allItems.filter((i) => i.status === "PENDING_APPROVAL").length,
        approved: allItems.filter((i) => i.status === "ACTIVE").length,
        resolved: allItems.filter((i) => i.status === "RESOLVED").length,
      });

      setActivities(logs.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const formatAction = (action) => {
    const map = {
      LOST_ITEM_REPORTED: "📦 Lost item reported",
      LOST_ITEM_APPROVED: "✅ Lost item approved",
      LOST_ITEM_REJECTED: "❌ Lost item rejected",
      FOUND_ITEM_REPORTED: "📚 Found item reported",
      FOUND_ITEM_APPROVED: "✅ Found item approved",
      FOUND_ITEM_REJECTED: "❌ Found item rejected",
      MATCH_APPROVED: "🔗 Match approved",
      MATCH_REJECTED: "❌ Match rejected",
      CLAIM_SUBMITTED: "📝 Claim submitted",
      CLAIM_APPROVED: "✅ Claim approved",
      CLAIM_REJECTED: "❌ Claim rejected",
      HANDOVER_SCHEDULED: "📅 Handover scheduled",
      HANDOVER_COMPLETED: "🏁 Handover completed",
      USER_REGISTERED: "👤 User registered",
    };

    return map[action] || action;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const totalItems = stats.lost + stats.found;

  const approvalRate =
    totalItems > 0 ? ((stats.approved / totalItems) * 100).toFixed(1) : 0;

  const insights = [
    `📈 ${approvalRate}% of reported items are approved`,
    stats.pending > 0
      ? `⏳ ${stats.pending} item reviews need attention`
      : "✅ No pending item reviews",
    `🔗 ${stats.matches} matches generated`,
    `📝 ${stats.claims} claims submitted`,
    `📅 ${stats.handovers} handovers scheduled`,
  ];

  const barData = [
    { name: "Lost", value: stats.lost },
    { name: "Found", value: stats.found },
    { name: "Matches", value: stats.matches },
    { name: "Claims", value: stats.claims },
    { name: "Resolved", value: stats.resolved },
  ];

  const pieData = [
    { name: "Pending", value: stats.pending },
    { name: "Approved", value: stats.approved },
    { name: "Resolved", value: stats.resolved },
  ];

  const colors = ["#facc15", "#10b981", "#8b5cf6"];

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
            Analytics Dashboard
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mt-2">
            Admin Control Center
          </h1>

          <p className="text-slate-600 text-lg mt-4 max-w-2xl">
            Monitor portal activity, item reports, matches, claims, and resolution progress.
          </p>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-5 mb-10">
          <StatCard title="Lost" value={stats.lost} icon="📦" color="bg-purple-100 text-purple-700" />
          <StatCard title="Found" value={stats.found} icon="📚" color="bg-blue-100 text-blue-700" />
          <StatCard title="Matches" value={stats.matches} icon="🔗" color="bg-green-100 text-green-700" />
          <StatCard title="Claims" value={stats.claims} icon="📝" color="bg-pink-100 text-pink-700" />
          <StatCard title="Handovers" value={stats.handovers} icon="📅" color="bg-indigo-100 text-indigo-700" />
          <StatCard title="Pending" value={stats.pending} icon="⏳" color="bg-yellow-100 text-yellow-700" />
          <StatCard title="Approved" value={stats.approved} icon="✅" color="bg-emerald-100 text-emerald-700" />
          <StatCard title="Resolved" value={stats.resolved} icon="🏁" color="bg-slate-100 text-slate-700" />
        </div>

       {/* Admin Insights */}
<div className="bg-gradient-to-r from-purple-100 via-purple-50 to-indigo-100 rounded-3xl shadow-md border border-purple-200 p-6 mb-10">
  <h2 className="text-2xl font-bold text-purple-700 mb-2">
    📊 Admin Insights
  </h2>

  <p className="text-slate-500 mb-5">
    AI-generated insights based on current portal activity.
  </p>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {insights.map((item, index) => (
      <div
        key={index}
        className="bg-white rounded-2xl p-4 border border-purple-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
      >
        <p className="font-semibold text-slate-700">
          {item}
        </p>
      </div>
    ))}
  </div>
</div>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <ChartCard title="Portal Activity Overview">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Item Status Distribution">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="bg-white border border-purple-100 rounded-3xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-bold text-purple-700 mb-5">
            Recent Activities
          </h2>

          {activities.length === 0 ? (
            <p className="text-slate-500">No recent activities yet.</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.auditId}
                  className="border-l-4 border-purple-500 bg-slate-50 rounded-xl px-4 py-3"
                >
                  <p className="font-bold text-slate-900">
                    {formatAction(activity.action)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {activity.entityName} #{activity.entityId}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDate(activity.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
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

      <h2 className="text-3xl font-bold text-slate-900 mt-1">
        {value}
      </h2>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white border border-purple-100 rounded-3xl shadow-md p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-5">{title}</h3>
      {children}
    </div>
  );
}

export default AdminDashboard;