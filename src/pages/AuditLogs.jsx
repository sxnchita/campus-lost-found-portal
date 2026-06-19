import { useEffect, useState } from "react";
import API from "../services/api";
import AdminNavbar from "../components/AdminNavbar";
import Loader from "../components/Loader";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    setFilteredLogs(
      logs.filter(
        (log) =>
          (log.action || "").toLowerCase().includes(keyword) ||
          (log.entityName || "").toLowerCase().includes(keyword) ||
          String(log.userId || "").includes(keyword)
      )
    );
  }, [search, logs]);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/audit-logs");
      setLogs(res.data);
      setFilteredLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-lg p-8 mb-8">
          <p className="uppercase text-purple-600 text-sm font-semibold tracking-widest">
            System Monitoring
          </p>

          <h1 className="text-5xl font-extrabold text-slate-900 mt-2">
            Audit Logs
          </h1>

          <p className="text-slate-600 mt-3">
            Track every important action performed within the Lost & Found Portal.
          </p>

          <div className="mt-6 flex flex-col md:flex-row justify-between gap-4">
            <input
              type="text"
              placeholder="🔍 Search by action, entity or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="bg-purple-100 text-purple-700 px-5 py-3 rounded-xl font-semibold">
              Total Logs: {filteredLogs.length}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-4 text-left">Time</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Action</th>
                <th className="p-4 text-left">Entity</th>
                <th className="p-4 text-left">Entity ID</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-8 text-slate-500"
                  >
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.auditId}
                    className="border-b hover:bg-purple-50 transition"
                  >
                    <td className="p-4">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="p-4 font-medium text-slate-700">
                      {log.userName || `User #${log.userId ?? "System"}`}
                    </td>

                    <td className="p-4">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {log.action}
                      </span>
                    </td>

                    <td className="p-4">{log.entityName}</td>

                    <td className="p-4 font-semibold text-slate-700">
                      #{log.entityId}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;