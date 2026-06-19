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
            Admin Review
          </p>

          <h1 className="text-5xl font-extrabold text-slate-900 mt-2">
            Item Matches
          </h1>

          <p className="text-slate-600 mt-3">
            Review AI-generated matches between lost and found items.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            No matches found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((match) => {
              const id = match.matchId || match.id;
              const status = match.matchStatus || match.status;

              return (
                <div
                  key={id}
                  className="bg-white border border-purple-100 rounded-3xl shadow-md p-6"
                >
                  <h2 className="text-2xl font-bold text-purple-700 mb-4">
                    Match #{id}
                  </h2>

                  <p>
                    <b>Lost Item:</b>{" "}
                    {match.lostItem?.itemName || "N/A"}
                  </p>

                  <p>
                    <b>Found Item:</b>{" "}
                    {match.foundItem?.itemName || "N/A"}
                  </p>

                  <p>
                    <b>Match Score:</b>{" "}
                    {match.matchScore ?? "N/A"}
                  </p>

                  <p>
                    <b>Match Level:</b>{" "}
                    {match.matchLevel ?? "N/A"}
                  </p>

                  <p className="mt-2">
                    <b>Status:</b>{" "}
                    <span className="text-purple-700 font-semibold">
                      {status}
                    </span>
                  </p>

                  {(status === "PENDING_ADMIN_REVIEW" ||
                    status === "PENDING") && (
                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() =>
                          updateMatch(id, "approve")
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateMatch(id, "reject")
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
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

export default AdminMatches;