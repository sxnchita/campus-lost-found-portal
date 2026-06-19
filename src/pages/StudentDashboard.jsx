import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  const email = localStorage.getItem("email") || "Student";

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navbar logout={logout} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-xl p-10 mb-10">
          <p className="uppercase text-blue-500 font-semibold tracking-wider text-sm">
            Welcome Back
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mt-2">
            Lost Something?
          </h1>

          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600">
            Found Something?
          </h1>

          <p className="text-slate-600 text-lg mt-4 max-w-2xl">
            Helping students reconnect with their belongings quickly and securely.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 max-w-3xl">
            <ActionButton
              to="/report-lost"
              icon="📦"
              title="Report Lost Item"
              desc="Submit details of your lost belongings."
              color="bg-blue-600 hover:bg-blue-700"
            />

            <ActionButton
              to="/report-found"
              icon="🎁"
              title="Report Found Item"
              desc="Help return an item to its rightful owner."
              color="bg-blue-500 hover:bg-blue-600"
            />
          </div>
        </section>

        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          Quick Actions
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <QuickCard to="/lost-items" icon="🔍" title="Browse Lost Items" />
          <QuickCard to="/found-items" icon="📚" title="Browse Found Items" />
          <QuickCard to="/claims" icon="📝" title="My Claims" />
          <QuickCard to="/handovers" icon="📅" title="My Handovers" />
          <QuickCard to="/notifications" icon="🔔" title="Notifications" />
        </div>

        <div className="mt-12 text-center text-slate-500">
          Logged in as <strong>{email}</strong>
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

function QuickCard({ to, icon, title }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg">{title}</h3>
    </Link>
  );
}

export default StudentDashboard;