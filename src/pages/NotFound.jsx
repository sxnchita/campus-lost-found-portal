import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 px-6">
      <h1 className="text-8xl font-extrabold text-blue-600">404</h1>

      <h2 className="text-3xl font-bold text-slate-800 mt-4">
        Oops! Page Not Found
      </h2>

      <p className="text-slate-600 mt-2 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/student-dashboard"
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
      >
        🏠 Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;