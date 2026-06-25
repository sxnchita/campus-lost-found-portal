import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

function Claims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");
      const res = await API.get("/claims");
      const allClaims = Array.isArray(res.data) ? res.data : [];

      const myClaims = allClaims.filter(
        (claim) => String(claim.claimantId) === String(userId)
      );

      setClaims(myClaims);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load claims.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const getProgressText = (status) => {
    if (status === "APPROVED") return "Claim approved by administrator";
    if (status === "REJECTED") return "Claim rejected";
    return "Awaiting admin review";
  };

  const getDotColor = (status) => {
    if (status === "APPROVED") return "bg-green-500";
    if (status === "REJECTED") return "bg-red-500";
    return "bg-yellow-500";
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navbar logout={logout} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8">
          <p className="uppercase text-blue-500 text-sm font-semibold tracking-widest">
            Claim Center
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2">
            📝 My Claims
          </h1>

          <p className="text-slate-600 mt-3 mb-8">
            View your submitted claims and track their approval status.
          </p>

          {claims.length === 0 ? (
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-10 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h2 className="text-2xl font-bold text-blue-700">
                No claims yet
              </h2>
              <p className="text-slate-600 mt-2">
                When you submit ownership claims, they’ll appear here.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {claims.map((claim) => {
                const status = claim.claimStatus || "PENDING";

                return (
                  <div
                    key={claim.claimId}
                    className="bg-white border border-blue-100 rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-blue-700">
                        📝 Claim #{claim.claimId}
                      </h2>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusStyle(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="space-y-2 text-slate-600">
                      <p>
                        <b>🔗 Match ID:</b> {claim.matchId || "N/A"}
                      </p>

                      <p>
                        <b>📌 Ownership Proof:</b>{" "}
                        {claim.ownershipProof || "Not provided"}
                      </p>

                      <p>
                        <b>🏷️ Special Marks:</b>{" "}
                        {claim.specialMarks || "Not provided"}
                      </p>

                      <p>
                        <b>🗒️ Notes:</b>{" "}
                        {claim.additionalNotes || "No additional notes"}
                      </p>
                    </div>

                    <div className="mt-5 bg-blue-50 rounded-2xl p-4 border border-blue-100">
                      <p className="text-sm font-semibold text-blue-700">
                        Claim Progress
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getDotColor(
                            status
                          )}`}
                        />

                        <span className="text-sm text-slate-600">
                          {getProgressText(status)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Claims;