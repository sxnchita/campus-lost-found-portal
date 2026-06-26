import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

function MyFoundItems() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  useEffect(() => {
    fetchMyFoundItems();
  }, []);

  const fetchMyFoundItems = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");

      const res = await API.get("/found-items");
      const allItems = Array.isArray(res.data) ? res.data : [];

      const myItems = allItems.filter(
        (item) => String(item.reportedById) === String(userId)
      );

      setItems(myItems);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your found items.");
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

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      String(item.itemName || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar logout={logout} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-blue-100">
          <p className="uppercase text-blue-600 font-semibold tracking-widest text-sm">
            Finder Journey
          </p>

          <h1 className="text-5xl font-extrabold text-slate-900 mt-2">
            My Found Items
          </h1>

          <p className="text-slate-600 mt-3">
            Track the return progress of items you reported as found.
          </p>
        </section>

        <div className="bg-white border border-blue-100 rounded-2xl shadow-md p-5 mb-8">
          <input
            type="text"
            placeholder="🔍 Search your found items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-500">
            No found items reported by you yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.foundItemId}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6 border border-blue-100"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                      {item.itemName}
                    </h2>
                    <p className="text-slate-500 mt-1">Return Progress</p>
                  </div>

                  <Badge status={item.status} />
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 my-5 space-y-2 text-slate-700">
                  <p><b>📍 Found Location:</b> {item.foundLocation || "N/A"}</p>
                  <p><b>📅 Found Date:</b> {formatDate(item.foundDate)}</p>
                  <p><b>🏷️ Category:</b> {item.category || "N/A"}</p>
                </div>

                <div className="mt-5">
                  <p className="font-semibold text-slate-800 mb-3">
                    🔄 Workflow Progress
                  </p>

                  <div className="space-y-3">
                    <Step done={item.status === "ACTIVE" || item.status === "RETURNED"} label="Report Approved" />
                    <Step done={item.matchStatus && item.matchStatus !== "NO_MATCH"} label="Match Found" />
                    <Step done={item.claimStatus === "APPROVED"} label="Owner Verified" />
                    <Step done={item.handoverStatus === "SCHEDULED" || item.handoverStatus === "COMPLETED"} label="Handover Scheduled" />
                    <Step done={item.handoverStatus === "COMPLETED"} label="Item Returned" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Step({ done, label }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
          done ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500"
        }`}
      >
        {done ? "✓" : "•"}
      </span>
      <span className={done ? "text-slate-800 font-medium" : "text-slate-500"}>
        {label}
      </span>
    </div>
  );
}

function Badge({ status }) {
  const color =
    status === "ACTIVE"
      ? "bg-green-100 text-green-700"
      : status === "REJECTED"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
      {status || "PENDING"}
    </span>
  );
}

export default MyFoundItems;