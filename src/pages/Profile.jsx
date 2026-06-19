import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    lost: 0,
    found: 0,
    claims: 0,
    matches: 0,
  });

  const email = localStorage.getItem("email") || "student@example.com";
  const name = localStorage.getItem("name") || "Student";
  const role = localStorage.getItem("role") || "STUDENT";
  const userId = localStorage.getItem("userId");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  useEffect(() => {
    fetchProfileStats();
  }, []);

  const fetchProfileStats = async () => {
    try {
      setLoading(true);

      const [lostRes, foundRes, claimsRes, matchesRes] = await Promise.all([
        API.get("/lost-items"),
        API.get("/found-items"),
        API.get("/claims"),
        API.get(`/matches/student/${userId}`),
      ]);

      const lostItems = Array.isArray(lostRes.data) ? lostRes.data : [];
      const foundItems = Array.isArray(foundRes.data) ? foundRes.data : [];
      const claims = Array.isArray(claimsRes.data) ? claimsRes.data : [];
      const matches = Array.isArray(matchesRes.data) ? matchesRes.data : [];

      setStats({
        lost: lostItems.filter(
          (item) => String(item.reportedById) === String(userId)
        ).length,
        found: foundItems.filter(
          (item) => String(item.reportedById) === String(userId)
        ).length,
        claims: claims.filter(
          (claim) => String(claim.claimantId) === String(userId)
        ).length,
        matches: matches.length,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile stats.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navbar logout={logout} />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-6xl shadow-lg">
              👤
            </div>

            <div className="text-center md:text-left">
              <p className="uppercase text-blue-500 text-sm font-semibold tracking-widest">
                My Profile
              </p>

              <h1 className="text-4xl font-extrabold text-slate-900 mt-2">
                {name}
              </h1>

              <p className="text-slate-600 mt-2">{email}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
                  {role}
                </span>

                <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full font-semibold">
                  User ID: {userId || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-10">
            <StatCard icon="📦" title="Lost Reports" value={stats.lost} />
            <StatCard icon="🎁" title="Found Reports" value={stats.found} />
            <StatCard icon="🤝" title="Matches" value={stats.matches} />
            <StatCard icon="📝" title="Claims" value={stats.claims} />
          </div>

          <div className="mt-10 bg-blue-50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-3">
              Account Summary
            </h2>

            <div className="grid md:grid-cols-2 gap-4 text-slate-700">
              <p>
                <b>Name:</b> {name}
              </p>
              <p>
                <b>Email:</b> {email}
              </p>
              <p>
                <b>Role:</b> {role}
              </p>
              <p>
                <b>Status:</b> Active
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-blue-50 rounded-2xl p-6 text-center hover:shadow-md transition">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <p className="text-3xl font-extrabold text-blue-700 mt-2">{value}</p>
    </div>
  );
}

export default Profile;