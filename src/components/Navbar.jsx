import { NavLink } from "react-router-dom";

function Navbar({ logout }) {
  const navClass = ({ isActive }) =>
    `shrink-0 px-3 py-2 rounded-xl transition-all font-medium text-sm ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-blue-700 hover:bg-blue-100"
    }`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4 px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-700 whitespace-nowrap">
          🎒 Campus Lost & Found
        </h1>

        <div className="flex items-center gap-3 shrink-0">
          <NavLink
            to="/notifications"
            className="text-2xl hover:scale-110 transition"
            title="Notifications"
          >
            🔔
          </NavLink>

          <NavLink
            to="/profile"
            className="bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-xl text-blue-700 font-medium transition whitespace-nowrap"
          >
            👤 Profile
          </NavLink>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition whitespace-nowrap"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto flex flex-nowrap gap-2 overflow-x-auto px-6 pb-4">
        <NavLink to="/student-dashboard" className={navClass}>
          🏠 Dashboard
        </NavLink>

        <NavLink to="/report-lost" className={navClass}>
          📦 Report Lost
        </NavLink>

        <NavLink to="/report-found" className={navClass}>
          📚 Report Found
        </NavLink>

        <NavLink to="/lost-items" className={navClass}>
          🔍 Lost Items
        </NavLink>

        <NavLink to="/found-items" className={navClass}>
          🎯 Found Items
        </NavLink>

        <NavLink to="/student-matches" className={navClass}>
          🤝 My Matches
        </NavLink>

        <NavLink to="/claims" className={navClass}>
          📝 My Claims
        </NavLink>

        <NavLink to="/handovers" className={navClass}>
          📅 My Handovers
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;