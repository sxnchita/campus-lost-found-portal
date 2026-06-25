import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  const email = localStorage.getItem("email") || "Student";
  const name = email.split("@")[0];

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navbar logout={logout} />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Hero Section */}
        <section className="bg-white rounded-3xl shadow-xl p-10 mb-10 border border-blue-100">
          <p className="uppercase text-blue-500 font-semibold tracking-wider text-sm">
            Welcome Back
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mt-3">
            Hello, {name} 👋
          </h1>

          <h2 className="text-3xl md:text-5xl font-bold text-blue-600 mt-2">
            Lost Something? Found Something?
          </h2>

          <p className="text-slate-600 text-lg mt-5 max-w-2xl">
            Report lost items, help others recover belongings, submit claims,
            and track handovers through a secure and smart portal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 max-w-3xl">
            <ActionButton
              to="/report-lost"
              icon="📦"
              title="Report Lost Item"
              desc="Submit details about your missing belongings."
              color="bg-blue-600 hover:bg-blue-700"
            />

            <ActionButton
              to="/report-found"
              icon="🎁"
              title="Report Found Item"
              desc="Help return an item to its rightful owner."
              color="bg-cyan-600 hover:bg-cyan-700"
            />
          </div>
        </section>

        {/* Feature Cards */}
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          Quick Actions
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <QuickCard
            to="/lost-items"
            icon="🔍"
            title="Browse Lost Items"
            desc="Search reported lost items."
          />

          <QuickCard
            to="/found-items"
            icon="📚"
            title="Browse Found Items"
            desc="View items found by others."
          />

          <QuickCard
            to="/claims"
            icon="📝"
            title="My Claims"
            desc="Track submitted claims."
          />

          <QuickCard
            to="/handovers"
            icon="📅"
            title="My Handovers"
            desc="View scheduled handovers."
          />

          <QuickCard
            to="/notifications"
            icon="🔔"
            title="Notifications"
            desc="Check latest updates."
          />
        </div>

        {/* Info Banner */}
        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-3xl p-6">
          <h3 className="font-bold text-blue-800 text-lg">
            💡 Smart Matching Enabled
          </h3>

          <p className="text-blue-700 mt-2">
            Our matching engine automatically compares lost and found items
            using category, item name, color, location, and description
            similarity to help reunite owners faster.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500">
          Logged in as <strong>{email}</strong>

          <p className="mt-4 text-sm">
            Lost & Found Portal • Built with React, Spring Boot, MySQL & Redis
          </p>
        </div>
      </main>
    </div>
  );
}

function ActionButton({ to, icon, title, desc, color }) {
  return (
    <Link
      to={to}
      className={`${color} rounded-2xl p-5 text-white shadow-lg transition hover:-translate-y-1`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-bold text-xl">{title}</h3>
      <p className="text-sm text-blue-100 mt-1">{desc}</p>
    </Link>
  );
}

function QuickCard({ to, icon, title, desc }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-2xl p-6 shadow-md border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition"
    >
      <div className="text-4xl mb-3">{icon}</div>

      <h3 className="font-bold text-lg text-slate-900">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-2">
        {desc}
      </p>
    </Link>
  );
}

export default StudentDashboard;