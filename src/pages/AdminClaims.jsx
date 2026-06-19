import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Loader from "../components/Loader";
import AdminNavbar from "../components/AdminNavbar";

function AdminClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await API.get("/claims");
      setClaims(res.data || []);
    } catch {
      toast.error("Failed to load claims.");
    } finally {
      setLoading(false);
    }
  };

  const updateClaim = async (id, action) => {
    try {
      await API.put(`/claims/${id}/${action}`);
      toast.success(`Claim ${action}d successfully`);
      fetchClaims();
    } catch {
      toast.error(`Failed to ${action} claim.`);
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
            Claims
          </h1>

          <p className="text-slate-600 mt-3">
            Review ownership claims submitted by students.
          </p>
        </div>

        {claims.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            No claims found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {claims.map((claim) => {
              const id = claim.claimId || claim.id;
              const status = claim.claimStatus || claim.status;

              return (
                <div
                  key={id}
                  className="bg-white border border-purple-100 rounded-3xl shadow-md p-6"
                >
                  <h2 className="text-2xl font-bold text-purple-700 mb-4">
                    Claim #{id}
                  </h2>

                  <p>
                    <b>Match ID:</b>{" "}
                    {claim.matchId || "N/A"}
                  </p>

                  <p>
                    <b>User ID:</b>{" "}
                    {claim.userId || "N/A"}
                  </p>

                  <p className="mt-3">
                    <b>Ownership Proof:</b>
                  </p>

                  <div className="bg-slate-50 border rounded-xl p-3 mt-2">
                    {claim.ownershipProof || "No proof provided"}
                  </div>

                  <p className="mt-3">
                    <b>Status:</b>{" "}
                    <span className="text-purple-700 font-semibold">
                      {status}
                    </span>
                  </p>

                  {(status === "PENDING" ||
                    status === "PENDING_APPROVAL") && (
                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() =>
                          updateClaim(id, "approve")
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateClaim(id, "reject")
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

export default AdminClaims;