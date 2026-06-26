import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import API from "../services/api";

function Navbar({ logout }) {
  const [open, setOpen] = useState(false);
  const [hasFoundItems, setHasFoundItems] = useState(false);

  useEffect(() => {
    const checkFoundItems = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await API.get("/found-items");
        const items = Array.isArray(res.data) ? res.data : [];

        const mine = items.some(
          (item) => String(item.reportedById) === String(userId)
        );

        setHasFoundItems(mine);
      } catch {
        setHasFoundItems(false);
      }
    };

    checkFoundItems();
  }, []);

  const navClass = ({ isActive }) =>
    `px-4 py-3 rounded-xl transition-all font-medium ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-blue-700 hover:bg-blue-100"
    }`;

  const links = [
    { to: "/student-dashboard", label: "🏠 Dashboard" },
    { to: "/report-lost", label: "📦 Report Lost" },
    { to: "/report-found", label: "📚 Report Found" },
    { to: "/lost-items", label: "🔍 Lost Items" },
    { to: "/found-items", label: "🎯 Found Items" },
    ...(hasFoundItems
      ? [{ to: "/my-found-items", label: "📌 My Found Items" }]
      : []),
    { to: "/student-matches", label: "🤝 My Matches" },
    { to: "/claims", label: "📝 My Claims" },
    { to: "/handovers", label: "📅 My Handovers" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4 px-6 py-4">
        <h1 className="text-xl md:text-2xl font-bold text-blue-700 whitespace-nowrap">
          🎒 Campus Lost & Found
        </h1>

        <div className="hidden lg:flex items-center gap-3">
          <NavLink
            to="/notifications"
            className="text-2xl hover:scale-110 transition"
            title="Notifications"
          >
            🔔
          </NavLink>

          <NavLink
            to="/profile"
            className="bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-xl text-blue-700 font-medium transition"
          >
            👤 Profile
          </NavLink>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
          >
            🚪 Logout
          </button>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="lg:hidden bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-bold"
        >
          ☰
        </button>
      </div>

      <nav className="hidden lg:flex max-w-7xl mx-auto flex-nowrap gap-2 overflow-x-auto px-6 pb-4">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={navClass}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-blue-700">🎒 Menu</h2>

              <button
                onClick={() => setOpen(false)}
                className="text-2xl text-slate-500"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={navClass}
                >
                  {link.label}
                </NavLink>
              ))}

              <hr className="my-2" />

              <NavLink
                to="/notifications"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-blue-700 hover:bg-blue-100"
              >
                🔔 Notifications
              </NavLink>

              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-blue-700 hover:bg-blue-100"
              >
                👤 Profile
              </NavLink>

              <button
                onClick={logout}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold text-left transition"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;