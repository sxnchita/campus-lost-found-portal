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
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navbar logout={logout} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <p className="uppercase text-blue-500 text-sm font-semibold tracking-wide">
            Claim Center
          </p>

          <h1 className="text-4xl font-extrabold text-slate-900 mt-2 mb-2">
            📝 My Claims
          </h1>

          <p className="text-slate-600 mb-8">
            View and track the status of your submitted claims.
          </p>

          {claims.length === 0 ? (
            <div className="bg-blue-50 rounded-3xl p-10 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h2 className="text-2xl font-bold text-blue-700">
                No Claims Yet
              </h2>
              <p className="text-slate-600 mt-2">
                Your submitted claims will appear here.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {claims.map((claim) => {
                const status = claim.claimStatus || "PENDING";

                return (
                  <div
                    key={claim.claimId}
                    className="bg-blue-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                  >
                    <h2 className="text-xl font-bold text-blue-700">
                      {claim.itemName || "Claim"} #{claim.claimId}
                    </h2>

                    <p className="text-slate-600 mt-2">
                      <b>Match ID:</b> {claim.matchId || "N/A"}
                    </p>

                    <p className="text-slate-600">
                      <b>Proof:</b> {claim.ownershipProof || "N/A"}
                    </p>

                    <p className="text-slate-600">
                      <b>Special Marks:</b> {claim.specialMarks || "N/A"}
                    </p>

                    <p className="text-slate-600">
                      <b>Additional Notes:</b>{" "}
                      {claim.additionalNotes || "N/A"}
                    </p>

                    <span
                      className={`inline-block mt-4 px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Claims;