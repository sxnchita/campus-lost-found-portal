import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 flex items-center justify-center px-6">
      <div className="text-center bg-white/80 p-10 rounded-3xl shadow-xl max-w-3xl">
        <h1 className="text-5xl font-bold text-purple-700 mb-4">
          Campus Lost & Found Portal
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Find what's lost. Return what's found.
        </p>
        <Link
          to="/auth"
          className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default Home;