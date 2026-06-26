import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";

function StudentHandovers() {
  const [handovers, setHandovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  useEffect(() => {
    fetchHandovers();
  }, []);

  const fetchHandovers = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("User not found. Please login again.");
        return;
      }

      const res = await API.get(`/handovers/student/${userId}`);
      setHandovers(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load handover schedules.");
    } finally {
      setLoading(false);
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

  const filteredHandovers = handovers.filter((handover) => {
    const keyword = search.toLowerCase();

    return (
      String(handover.handoverId || "").includes(keyword) ||
      String(handover.claimId || "").includes(keyword) ||
      String(handover.itemName || "").toLowerCase().includes(keyword) ||
      String(handover.pickupLocation || "").toLowerCase().includes(keyword) ||
      String(handover.pickupDate || "").toLowerCase().includes(keyword) ||
      String(handover.handoverStatus || "").toLowerCase().includes(keyword)
    );
  });

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar logout={logout} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-blue-100">
          <p className="uppercase text-blue-600 font-semibold tracking-widest text-sm">
            Pickup Details
          </p>

          <h1 className="text-5xl font-extrabold text-slate-900 mt-2">
            My Handovers
          </h1>

          <p className="text-slate-600 mt-3">
            View your pickup location, date, time, instructions, and handover status.
          </p>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl shadow-md p-5 mb-8">
          <input
            type="text"
            placeholder="🔍 Search by item, claim ID, location, date, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredHandovers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-500">
            No handover schedules found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredHandovers.map((handover) => (
              <div
                key={handover.handoverId}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6 border border-blue-100"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                      {handover.itemName || "Item"} Handover
                    </h2>
                    <p className="text-slate-500 mt-1">Pickup Details</p>
                  </div>

                  <Badge status={handover.handoverStatus} />
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 my-5 space-y-2 text-slate-700">
                  <p><b>📦 Item:</b> {handover.itemName || "N/A"}</p>
                  <p><b>🆔 Claim ID:</b> #{handover.claimId}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-slate-700">
                  <p><b>📅 Pickup Date:</b> {formatDate(handover.pickupDate)}</p>
                  <p><b>🕒 Pickup Time:</b> {formatTime(handover.pickupTime)}</p>
                  <p><b>📍 Pickup Location:</b> {handover.pickupLocation || "N/A"}</p>
                </div>

                <div className="mt-5">
                  <p className="font-semibold text-slate-800">
                    📋 Instructions
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-2 text-slate-700">
                    {handover.instructions || "No instructions provided."}
                  </div>
                </div>

                {handover.handoverStatus === "COMPLETED" && (
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
  const color =
    status === "COMPLETED"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
      {status || "SCHEDULED"}
    </span>
  );
}

export default StudentHandovers;