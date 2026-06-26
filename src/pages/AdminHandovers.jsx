import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import AdminNavbar from "../components/AdminNavbar";
import Loader from "../components/Loader";

function AdminHandovers() {
  const [handovers, setHandovers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    claimId: "",
    scheduledById: localStorage.getItem("userId") || "",
    pickupLocation: "",
    pickupDate: "",
    pickupTime: "",
    instructions: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [handoverRes, claimsRes] = await Promise.all([
        API.get("/handovers"),
        API.get("/claims"),
      ]);

      setHandovers(Array.isArray(handoverRes.data) ? handoverRes.data : []);

      const approvedClaims = Array.isArray(claimsRes.data)
        ? claimsRes.data.filter(
            (claim) => (claim.claimStatus || claim.status) === "APPROVED"
          )
        : [];

      setClaims(approvedClaims);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load handovers.");
    } finally {
      setLoading(false);
    }
  };

  const createHandover = async (e) => {
    e.preventDefault();

    if (!form.claimId) {
      toast.error("Please select an approved claim.");
      return;
    }

    try {
      await API.post("/handovers", {
        ...form,
        scheduledById: localStorage.getItem("userId"),
      });

      toast.success("Handover scheduled successfully!");

      setForm({
        claimId: "",
        scheduledById: localStorage.getItem("userId") || "",
        pickupLocation: "",
        pickupDate: "",
        pickupTime: "",
        instructions: "",
      });

      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to schedule handover.");
    }
  };

  const markCompleted = async (id) => {
    if (!window.confirm("Mark this handover as completed?")) return;

    try {
      await API.put(`/handovers/${id}/complete`);
      toast.success("Handover marked as completed.");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update handover.");
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

  const formatTime = (time) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getClaimLabel = (claim) => {
    const id = claim.claimId || claim.id;
    const itemName = claim.itemName || "Item";
    const claimantName = claim.claimantName || "Student";
    return `${itemName} — Claim #${id} — ${claimantName}`;
  };

  const filteredHandovers = handovers.filter((handover) => {
    const keyword = search.toLowerCase();

    return (
      String(handover.handoverId || "").includes(keyword) ||
      String(handover.claimId || "").includes(keyword) ||
      String(handover.itemName || "").toLowerCase().includes(keyword) ||
      String(handover.claimantName || "").toLowerCase().includes(keyword) ||
      String(handover.finderName || "").toLowerCase().includes(keyword) ||
      String(handover.pickupLocation || "").toLowerCase().includes(keyword) ||
      String(handover.handoverStatus || "").toLowerCase().includes(keyword)
    );
  });

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white border border-purple-100 rounded-3xl shadow-xl p-8 mb-8">
          <p className="uppercase text-purple-600 font-semibold tracking-widest text-sm">
            Final Step
          </p>

          <h1 className="text-5xl font-extrabold text-slate-900 mt-2">
            Handover Scheduling
          </h1>

          <p className="text-slate-600 mt-3">
            Schedule and manage pickup meetings for approved ownership claims.
          </p>
        </div>

        <form
          onSubmit={createHandover}
          className="bg-white border border-purple-100 rounded-3xl shadow-lg p-6 mb-8 grid md:grid-cols-2 gap-4"
        >
          <select
            required
            value={form.claimId}
            onChange={(e) => setForm({ ...form, claimId: e.target.value })}
            className="border border-purple-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Approved Claim</option>

            {claims.map((claim) => {
              const id = claim.claimId || claim.id;

              return (
                <option key={id} value={id}>
                  {getClaimLabel(claim)}
                </option>
              );
            })}
          </select>

          <input
            type="text"
            placeholder="Pickup Location"
            value={form.pickupLocation}
            onChange={(e) =>
              setForm({ ...form, pickupLocation: e.target.value })
            }
            className="border border-purple-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="date"
            value={form.pickupDate}
            onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
            className="border border-purple-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="time"
            value={form.pickupTime}
            onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}
            className="border border-purple-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <textarea
            placeholder="Instructions e.g. Bring student ID card"
            value={form.instructions}
            onChange={(e) =>
              setForm({ ...form, instructions: e.target.value })
            }
            className="border border-purple-200 rounded-xl p-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />

          <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl md:col-span-2 font-semibold">
            Schedule Handover
          </button>
        </form>

        <div className="bg-white border border-purple-100 rounded-2xl shadow-md p-5 mb-8">
          <input
            type="text"
            placeholder="🔍 Search by item, claimant, finder, claim ID, location, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

                {filteredHandovers.length === 0 ? (
          <div className="bg-white border border-purple-100 rounded-2xl shadow p-8 text-center text-slate-500">
            No handovers found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredHandovers.map((handover) => (
              <div
                key={handover.handoverId}
                className="bg-white border border-purple-100 rounded-3xl shadow-md hover:shadow-xl hover:shadow-purple-100 transition p-6"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                      {handover.itemName || "Item"} Handover
                    </h2>

                    <p className="text-slate-500 mt-1">
                      Approved Ownership Transfer
                    </p>
                  </div>

                  <Badge status={handover.handoverStatus} />
                </div>

                {/* People */}
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 my-5 space-y-2 text-slate-700">
                  <p>
                    <b>👤 Claimant:</b>{" "}
                    {handover.claimantName || "N/A"}
                  </p>

                  <p>
                    <b>👤 Finder:</b>{" "}
                    {handover.finderName || "N/A"}
                  </p>

                  <p>
                    <b>🆔 Claim ID:</b>{" "}
                    #{handover.claimId}
                  </p>
                </div>

                {/* Schedule */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                  <p>
                    <b>📅 Pickup Date:</b>{" "}
                    {formatDate(handover.pickupDate)}
                  </p>

                  <p>
                    <b>🕒 Pickup Time:</b>{" "}
                    {formatTime(handover.pickupTime)}
                  </p>

                  <p>
                    <b>📍 Pickup Location:</b>{" "}
                    {handover.pickupLocation}
                  </p>
                </div>

                {/* Instructions */}
                <div className="mt-5">
                  <p className="font-semibold text-slate-800">
                    📋 Handover Instructions
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-2 text-slate-700">
                    {handover.instructions || "No instructions provided."}
                  </div>
                </div>

                {handover.handoverStatus !== "COMPLETED" ? (
                  <button
                    onClick={() => markCompleted(handover.handoverId)}
                    className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-semibold w-full"
                  >
                    ✓ Mark Completed
                  </button>
                ) : (
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-xl py-3 text-center text-green-700 font-semibold">
                    ✅ Handover Completed
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Badge({ status }) {
  let color = "bg-yellow-100 text-yellow-700";

  if (status === "COMPLETED") {
    color = "bg-green-100 text-green-700";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}
    >
      {status || "SCHEDULED"}
    </span>
  );
}

export default AdminHandovers;