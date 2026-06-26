import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Loader from "../components/Loader";
import AdminNavbar from "../components/AdminNavbar";

function AdminClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

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

  const viewProfile = async (userId) => {
    try {
      const res = await API.get(`/users/${userId}`);
      setSelectedUser(res.data);
      setShowProfile(true);
    } catch {
      toast.error("Failed to load user profile.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
            Ownership Claims
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
                <div key={id} className="bg-white border border-purple-100 rounded-3xl shadow-md hover:shadow-xl hover:shadow-purple-100 transition p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">
                        {claim.itemName || "Item"} Claim
                      </h2>
                      <p className="text-slate-500 mt-1">Ownership Claim</p>
                    </div>

                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {status || "N/A"}
                    </span>
                  </div>

                  <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 my-5 space-y-2 text-slate-700">
                    <p><b>👤 Claimed By:</b> {claim.claimantName || "N/A"}</p>

                    {claim.claimantId && (
                      <button
                        onClick={() => viewProfile(claim.claimantId)}
                        className="text-purple-700 hover:underline text-sm font-semibold"
                      >
                        View User Profile
                      </button>
                    )}

                    <p><b>🆔 Match ID:</b> {claim.matchId || "N/A"}</p>
                    <p><b>📅 Submitted On:</b> {formatDate(claim.createdAt)}</p>
                  </div>

                  <p className="font-semibold text-slate-800">📝 Ownership Proof</p>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-2 text-slate-700">
                    {claim.ownershipProof || "No proof provided"}
                  </div>

                  {claim.specialMarks && (
                    <>
                      <p className="font-semibold text-slate-800 mt-4">🔎 Special Marks</p>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-2 text-slate-700">
                        {claim.specialMarks}
                      </div>
                    </>
                  )}

                  {claim.additionalNotes && (
                    <>
                      <p className="font-semibold text-slate-800 mt-4">🗒️ Additional Notes</p>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-2 text-slate-700">
                        {claim.additionalNotes}
                      </div>
                    </>
                  )}

                  {(status === "PENDING" || status === "PENDING_APPROVAL") && (
                    <div className="flex gap-3 mt-5">
                      <button onClick={() => updateClaim(id, "approve")} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl font-semibold">
                        Approve
                      </button>
                      <button onClick={() => updateClaim(id, "reject")} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold">
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

      {showProfile && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-purple-100">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">User Profile</h2>
                <p className="text-slate-500">Claimant details</p>
              </div>

              <button
                onClick={() => setShowProfile(false)}
                className="text-slate-500 hover:text-slate-900 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-slate-700">
              <p><b>👤 Name:</b> {selectedUser.fullName || "N/A"}</p>
              <p><b>📧 Email:</b> {selectedUser.email || "N/A"}</p>
              <p><b>🆔 Roll Number:</b> {selectedUser.rollNumber || "N/A"}</p>
              <p><b>🎓 Department:</b> {selectedUser.department || "N/A"}</p>
              <p><b>📱 Phone:</b> {selectedUser.phone || "N/A"}</p>
              <p><b>🔐 Role:</b> {selectedUser.role || "N/A"}</p>
              <p>
                <b>✅ Status:</b>{" "}
                {selectedUser.isActive ? "Active" : "Inactive"}
              </p>
            </div>

            <button
              onClick={() => setShowProfile(false)}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-2xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminClaims;