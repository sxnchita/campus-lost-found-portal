import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

function StudentMatches() {
  const [matches, setMatches] = useState([]);
  const [claimsByMatch, setClaimsByMatch] = useState({});
  const [loading, setLoading] = useState(true);

  const [claimForm, setClaimForm] = useState({
    matchId: "",
    ownershipProof: "",
    specialMarks: "",
    additionalNotes: "",
  });

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");

      const [matchesRes, claimsRes] = await Promise.all([
        API.get(`/matches/student/${userId}`),
        API.get("/claims"),
      ]);

      const matchData = Array.isArray(matchesRes.data) ? matchesRes.data : [];
      const claimData = Array.isArray(claimsRes.data) ? claimsRes.data : [];

      const myClaims = claimData.filter(
        (claim) => String(claim.claimantId) === String(userId)
      );

      const claimMap = {};
      myClaims.forEach((claim) => {
        claimMap[claim.matchId] = claim;
      });

      setMatches(matchData);
      setClaimsByMatch(claimMap);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load matches.");
    } finally {
      setLoading(false);
    }
  };

  const submitClaim = async (e) => {
    e.preventDefault();

    try {
      await API.post("/claims", {
        matchId: claimForm.matchId,
        claimantId: localStorage.getItem("userId"),
        ownershipProof: claimForm.ownershipProof,
        specialMarks: claimForm.specialMarks,
        additionalNotes: claimForm.additionalNotes,
      });

      toast.success("Claim submitted to admin!");

      setClaimForm({
        matchId: "",
        ownershipProof: "",
        specialMarks: "",
        additionalNotes: "",
      });

      fetchMatches();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data ||
          "Claim already submitted or failed."
      );
    }
  };

  const getClaimButton = (match) => {
    const claim = claimsByMatch[match.matchId];

    if (!claim) {
      return (
        <button
          onClick={() =>
            setClaimForm({
              ...claimForm,
              matchId: match.matchId,
            })
          }
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Claim This Item
        </button>
      );
    }

    const status = claim.claimStatus || "PENDING";

    const styles = {
      PENDING: "bg-yellow-100 text-yellow-700",
      APPROVED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
    };

    const labels = {
      PENDING: "⏳ Claim Under Review",
      APPROVED: "✅ Claim Approved",
      REJECTED: "❌ Claim Rejected",
    };

    return (
      <button
        disabled
        className={`mt-6 px-6 py-3 rounded-xl font-semibold cursor-not-allowed ${
          styles[status] || styles.PENDING
        }`}
      >
        {labels[status] || "Claim Already Submitted"}
      </button>
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar logout={logout} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-blue-100">
          <p className="uppercase text-blue-600 font-semibold tracking-widest text-sm">
            Match Center
          </p>

          <h1 className="text-4xl font-extrabold text-blue-700 mt-2">
            🎯 {matches.length} {matches.length === 1 ? "Match" : "Matches"} Found
          </h1>

          <p className="text-slate-600 mt-2">
            Compare lost and found item details, then submit a claim if the item belongs to you.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-500">
            No approved matches found yet.
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((match) => (
              <div
                key={match.matchId}
                className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100"
              >
                <div className="flex justify-between items-start mb-5">
                  <h2 className="text-2xl font-bold text-blue-700">
                    Match #{match.matchId}
                  </h2>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {match.matchStatus}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <ItemCard title="Lost Item" color="red" item={match.lostItem} type="lost" />
                  <ItemCard title="Found Item" color="green" item={match.foundItem} type="found" />
                </div>

                {claimForm.matchId === match.matchId ? (
                  <form onSubmit={submitClaim} className="mt-6 bg-blue-50 rounded-2xl p-5 space-y-4">
                    <textarea
                      required
                      placeholder="Ownership proof e.g. bill, unique detail, student ID proof..."
                      value={claimForm.ownershipProof}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, ownershipProof: e.target.value })
                      }
                      className="w-full border border-blue-200 rounded-xl p-3"
                      rows={3}
                    />

                    <input
                      placeholder="Special marks"
                      value={claimForm.specialMarks}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, specialMarks: e.target.value })
                      }
                      className="w-full border border-blue-200 rounded-xl p-3"
                    />

                    <textarea
                      placeholder="Additional notes"
                      value={claimForm.additionalNotes}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, additionalNotes: e.target.value })
                      }
                      className="w-full border border-blue-200 rounded-xl p-3"
                      rows={2}
                    />

                    <div className="flex gap-3">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold">
                        Submit Claim
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setClaimForm({
                            matchId: "",
                            ownershipProof: "",
                            specialMarks: "",
                            additionalNotes: "",
                          })
                        }
                        className="bg-gray-200 hover:bg-gray-300 text-slate-700 px-6 py-3 rounded-xl font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  getClaimButton(match)
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ItemCard({ title, color, item, type }) {
  const bg = color === "red" ? "bg-red-50" : "bg-green-50";
  const text = color === "red" ? "text-red-700" : "text-green-700";

  return (
    <div className={`${bg} rounded-2xl p-5`}>
      <h3 className={`font-bold ${text} mb-3`}>{title}</h3>

      {item?.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.itemName || "Item"}
          className="w-full h-48 object-cover rounded-xl mb-4 border shadow"
        />
      ) : (
        <div className="w-full h-48 bg-white/70 rounded-xl mb-4 border border-dashed flex items-center justify-center text-slate-400">
          No image available
        </div>
      )}

      <p><b>Name:</b> {item?.itemName || "N/A"}</p>
      <p><b>Category:</b> {item?.category || "N/A"}</p>
      <p><b>Color:</b> {item?.color || "N/A"}</p>
      <p><b>Model:</b> {item?.model || "N/A"}</p>
      <p>
        <b>Location:</b>{" "}
        {type === "lost" ? item?.lostLocation || "N/A" : item?.foundLocation || "N/A"}
      </p>
      <p>
        <b>Date:</b>{" "}
        {type === "lost" ? item?.lostDate || "N/A" : item?.foundDate || "N/A"}
      </p>
      <p><b>Description:</b> {item?.description || "N/A"}</p>
    </div>
  );
}

export default StudentMatches;