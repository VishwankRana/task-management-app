import { useEffect, useState } from "react";
import axios from "axios";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import { useTheme } from "../context/ThemeContext";

const TYPE_CONFIG = {
  TASK_ASSIGNED: {
    Icon: AssignmentIndRoundedIcon,
    iconColor: "#d97757",
    bg: "bg-[#d97757]/10 dark:bg-[#d97757]/20",
  },
  DUE_SOON: {
    Icon: EventRoundedIcon,
    iconColor: "#d97706",
    bg: "bg-amber-50 dark:bg-amber-500/15",
  },
  STATUS_CHANGED: {
    Icon: SwapHorizRoundedIcon,
    iconColor: "#2563eb",
    bg: "bg-blue-50 dark:bg-blue-500/15",
  },
  PRIORITY_CHANGED: {
    Icon: PriorityHighRoundedIcon,
    iconColor: "#7c3aed",
    bg: "bg-violet-50 dark:bg-violet-500/15",
  },
};

function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function NotificationPanel() {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  async function fetchNotifications() {
    try {
      const res = await axios.get("http://localhost:3000/api/notifications");
      setNotifications(res.data.notifications ?? []);
      setUnreadCount(res.data.unreadCount ?? 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  async function markAsRead(id) {
    try {
      await axios.patch(`http://localhost:3000/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  }

  async function markAllAsRead() {
    try {
      await axios.patch("http://localhost:3000/api/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="w-full rounded-2xl border border-[#1d3557]/15 dark:border-slate-700 bg-white dark:bg-[#1e293b] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-[#f8faff] dark:bg-[#0f172a]/50">
        <div className="flex items-center gap-3">
          <div className="relative bg-[#d97757]/10 rounded-lg p-1.5">
            <NotificationsRoundedIcon sx={{ color: "#d97757", fontSize: "1.4rem" }} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#d97757] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1D3557] dark:text-slate-100">
              Notifications
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Task assignments, due dates & updates
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-xs font-semibold text-[#d97757] hover:underline cursor-pointer"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-[#d97757] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-10 px-5 text-center">
            <NotificationsRoundedIcon
              sx={{ color: isDark ? "#475569" : "#cbd5e1", fontSize: "2.5rem", mb: 1 }}
            />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No notifications yet
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              You&apos;ll be notified when tasks are assigned or updated
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {notifications.map((notification) => {
              const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.TASK_ASSIGNED;
              const { Icon } = config;

              return (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => !notification.read && markAsRead(notification.id)}
                    className={`w-full flex items-start gap-3 px-5 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      !notification.read ? "bg-[#d97757]/5 dark:bg-[#d97757]/10" : ""
                    }`}
                  >
                    <div className={`shrink-0 rounded-xl p-2 ${config.bg}`}>
                      <Icon sx={{ fontSize: "1.1rem", color: config.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug ${
                          notification.read
                            ? "text-slate-600 dark:text-slate-400"
                            : "text-[#1D3557] dark:text-slate-100 font-semibold"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-[#d97757] mt-2" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
