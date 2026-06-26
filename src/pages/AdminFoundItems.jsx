import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Loader from "../components/Loader";
import AdminNavbar from "../components/AdminNavbar";

function AdminFoundItems() {
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    fetchFoundItems();
  }, []);

  const fetchFoundItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/found-items");
      setFoundItems(res.data);
    } catch {
      toast.error("Failed to load found items.");
    } finally {
      setLoading(false);
    }
  };

  const approveFoundItem = async (id) => {
    try {
      await API.put(`/found-items/${id}/approve`);
      toast.success("Found item approved");
      fetchFoundItems();
    } catch {
      toast.error("Failed to approve found item.");
    }
  };

  const rejectFoundItem = async (id) => {
    try {
      await API.put(`/found-items/${id}/reject`);
      toast.success("Found item rejected");
      fetchFoundItems();
    } catch {
      toast.error("Failed to reject found item.");
    }
  };

  const filteredItems = foundItems.filter((item) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      item.itemName?.toLowerCase().includes(keyword) ||
      item.category?.toLowerCase().includes(keyword) ||
      item.foundLocation?.toLowerCase().includes(keyword);

    const matchesStatus = status === "ALL" || item.status === status;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white border border-purple-100 rounded-3xl shadow-xl p-8 mb-8">
          <p className="uppercase text-purple-600 font-semibold tracking-widest text-sm">
            Admin Management
          </p>

          <h1 className="text-5xl font-extrabold text-slate-900 mt-2">
            Found Items
          </h1>

          <p className="text-slate-600 mt-3">
            Review, approve, reject, and search all reported found items.
          </p>
        </div>

        <div className="bg-white border border-purple-100 rounded-2xl shadow-md p-5 mb-8 grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by item, category, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:col-span-2 border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING_APPROVAL">Pending</option>
            <option value="ACTIVE">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white border border-purple-100 rounded-2xl shadow p-8 text-center text-slate-500">
            No found items found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.foundItemId}
                className="bg-white border border-purple-100 rounded-3xl shadow-md hover:shadow-xl hover:shadow-purple-100 transition p-6"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {item.itemName}
                    </h2>
                    <p className="text-slate-500">{item.category}</p>
                  </div>

                  <Badge status={item.status} />
                </div>

                <div className="mt-5 space-y-2 text-slate-700">
                  <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-4">
                    <p><b>👤 Found By:</b> {item.reportedByName || "N/A"}</p>

                    <p>
                      <b>📅 Found On:</b>{" "}
                      {item.foundDate
                        ? new Date(item.foundDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>

                    <p>
                      <b>🕒 Reported On:</b>{" "}
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>

                  <p><b>Location:</b> {item.foundLocation}</p>
                  <p><b>Color:</b> {item.color || "N/A"}</p>
                  <p><b>Model:</b> {item.model || "N/A"}</p>
                  <p><b>Description:</b> {item.description || "N/A"}</p>
                  <p><b>Notes:</b> {item.additionalNotes || "N/A"}</p>
                </div>

                {item.status === "PENDING_APPROVAL" && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => approveFoundItem(item.foundItemId)}
                      className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl font-semibold"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectFoundItem(item.foundItemId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold"
                    >
                      Reject
                    </button>
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
    status === "ACTIVE"
      ? "bg-green-100 text-green-700"
      : status === "REJECTED"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
      {status}
    </span>
  );
}

export default AdminFoundItems;