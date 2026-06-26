import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Loader from "../components/Loader";
import AdminNavbar from "../components/AdminNavbar";

function AdminMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await API.get("/matches");
      setMatches(res.data || []);
    } catch {
      toast.error("Failed to load matches.");
    } finally {
      setLoading(false);
    }
  };

  const updateMatch = async (id, action) => {
    try {
      await API.put(`/matches/${id}/${action}`);
      toast.success(`Match ${action}d successfully`);
      fetchMatches();
    } catch {
      toast.error(`Failed to ${action} match.`);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8 mb-8">
          <p className="uppercase text-purple-600 text-sm font-semibold tracking-widest">
            Smart Matching Engine
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2">
            Item Matches
          </h1>

          <p className="text-slate-600 mt-3 max-w-3xl">
            Review automated lost-and-found matches with participant details.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md border border-purple-100 p-10 text-center">
            <div className="text-5xl mb-3">🔍</div>
            <h2 className="text-2xl font-bold text-slate-800">
              No matches found yet
            </h2>
            <p className="text-slate-500 mt-2">
              Once lost and found items are reported, matches will appear here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((match) => {
              const id = match.matchId || match.id;
              const status = match.matchStatus || match.status;
              const score = match.matchScore ?? 0;

              return (
                <div
                  key={id}
                  className="bg-white border border-purple-100 rounded-3xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold text-purple-700">
                      Match #{id}
                    </h2>
                    <StatusBadge status={status} />
                  </div>

                  <ConfidenceMeter score={score} />

                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mt-5">
                    <h3 className="text-lg font-bold text-indigo-700 mb-3">
                      👥 Participants
                    </h3>

                    <p className="text-slate-700">
                      <b>🙍 Lost Reported By:</b>{" "}
                      {match.lostReportedByName || "N/A"}
                    </p>

                    <p className="text-slate-700">
                      <b>🙍 Found Reported By:</b>{" "}
                      {match.foundReportedByName || "N/A"}
                    </p>
                  </div>

                  <div className="grid gap-4 mt-5">
                    <ItemBox
                      title="Lost Item"
                      icon="📦"
                      name={match.lostItemName || match.lostItem?.itemName}
                    />

                    <ItemBox
                      title="Found Item"
                      icon="🎁"
                      name={match.foundItemName || match.foundItem?.itemName}
                    />
                  </div>

                  {(status === "PENDING_ADMIN_REVIEW" || status === "PENDING") && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => updateMatch(id, "approve")}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-semibold transition"
                      >
                        Approve Match
                      </button>

                      <button
                        onClick={() => updateMatch(id, "reject")}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-semibold transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function ConfidenceMeter({ score }) {
  const color =
    score >= 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";

  const label =
    score >= 80
      ? "🟢 High Confidence"
      : score >= 50
      ? "🟡 Medium Confidence"
      : "🔴 Low Confidence";

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
      <div className="flex justify-between mb-2">
        <p className="font-bold text-slate-800">{label}</p>
        <p className="font-bold text-purple-700">{score}%</p>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
      {status || "N/A"}
    </span>
  );
}

function ItemBox({ title, icon, name }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm font-bold text-purple-600 mb-2">
        {icon} {title}
      </p>

      <h3 className="text-lg font-bold text-slate-900">
        {name || "N/A"}
      </h3>
    </div>
  );
}

export default AdminMatches;