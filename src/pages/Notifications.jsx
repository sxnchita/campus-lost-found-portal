import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import API from "../services/api";
import Loader from "../components/Loader";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");

      const res = await API.get(`/notifications/user/${userId}`);

      if (Array.isArray(res.data)) {
        // newest first
        setNotifications(
          res.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } else {
        setNotifications([]);
      }
    } catch {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === id ? { ...n, isRead: true } : n
        )
      );
    } catch {
      toast.error("Failed to mark notification as read.");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "MATCH_FOUND":
        return "🔍";
      case "CLAIM_APPROVED":
        return "✅";
      case "CLAIM_REJECTED":
        return "❌";
      case "HANDOVER_SCHEDULED":
        return "📅";
      case "HANDOVER_COMPLETED":
        return "🎉";
      default:
        return "🔔";
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navbar logout={logout} />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <p className="uppercase text-blue-500 text-sm font-semibold tracking-wide">
            Stay Updated
          </p>

          <h1 className="text-4xl font-extrabold text-slate-900 mt-2 mb-2">
            🔔 Notifications
          </h1>

          <p className="text-slate-600 mb-8">
            View important updates about your reports, claims, and handovers.
          </p>

          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              🎉 You're all caught up! No notifications found.
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`flex items-start gap-4 p-5 rounded-2xl transition ${
                    notification.isRead
                      ? "bg-gray-50"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="text-3xl">
                    {getIcon(notification.notificationType)}
                  </div>

                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-blue-700">
                      {notification.title}
                    </h2>

                    <p className="text-slate-600 mt-1">
                      {notification.message}
                    </p>

                    <p className="text-xs text-slate-400 mt-2">
                      {notification.createdAt}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <button
                      onClick={() =>
                        markAsRead(notification.notificationId)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Notifications;