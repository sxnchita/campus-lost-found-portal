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

      if (Array.isArray(res.data)) {
        setHandovers(res.data);
      } else {
        setHandovers([]);
      }
    } catch {
      toast.error("Failed to load handover schedules.");
    } finally {
      setLoading(false);
    }
  };

  const filteredHandovers = handovers.filter((handover) => {
    const keyword = search.toLowerCase();

    return (
      String(handover.handoverId || "").includes(keyword) ||
      String(handover.claimId || "").includes(keyword) ||
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
            placeholder="🔍 Search by handover ID, claim ID, location, date, or status..."
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
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-blue-700">
                    Handover #{handover.handoverId}
                  </h2>

                  <Badge status={handover.handoverStatus} />
                </div>

                <div className="space-y-2 text-slate-700">
                  <p><b>Claim ID:</b> #{handover.claimId}</p>
                  <p><b>Pickup Location:</b> {handover.pickupLocation}</p>
                  <p><b>Date:</b> {handover.pickupDate}</p>
                  <p><b>Time:</b> {handover.pickupTime}</p>
                  <p><b>Instructions:</b> {handover.instructions || "N/A"}</p>
                </div>
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