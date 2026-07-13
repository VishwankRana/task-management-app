import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import api from "../utils/api.js";

export default function UserFeatureSettingsModal({ user, open, onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [calendarEnabled, setCalendarEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    if (!open || !user?.id) return;

    async function load() {
      setLoading(true);
      try {
        const res = await api.get(`/api/auth/users/${user.id}/feature-access`);
        setCalendarEnabled(res.data.calendarEnabled);
        setAnalyticsEnabled(res.data.analyticsEnabled);
      } catch (err) {
        toast.error(err.response?.data?.error ?? "Failed to load settings");
        onClose();
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [open, user?.id, onClose]);

  async function handleSave() {
    if (user.role === "Admin") {
      onClose();
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/api/auth/users/${user.id}/feature-access`, {
        calendarEnabled,
        analyticsEnabled,
      });
      toast.success("Feature access updated");
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error ?? "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (!open || !user) return null;

  const isAdminUser = user.role === "Admin";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <SettingsRoundedIcon sx={{ color: "#d97757", fontSize: "1.25rem" }} />
            <div>
              <h2 className="text-base font-bold text-[#1D3557] dark:text-slate-100">User settings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <CloseRoundedIcon fontSize="small" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">Loading…</p>
          ) : isAdminUser ? (
            <p className="text-sm text-slate-600 dark:text-slate-400 py-4">
              Admin accounts always have access to Calendar and Analytics.
            </p>
          ) : (
            <>
              <FeatureToggle
                icon={<CalendarMonthRoundedIcon sx={{ fontSize: "1.1rem", color: "#d97757" }} />}
                label="Calendar"
                description="Allow this user to view the project calendar"
                enabled={calendarEnabled}
                onChange={setCalendarEnabled}
              />
              <FeatureToggle
                icon={<QueryStatsRoundedIcon sx={{ fontSize: "1.1rem", color: "#d97757" }} />}
                label="Analytics"
                description="Allow this user to view project analytics"
                enabled={analyticsEnabled}
                onChange={setAnalyticsEnabled}
              />
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          {!isAdminUser && (
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || saving}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: "#d97757" }}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureToggle({ icon, label, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-[#263446]/50">
      <div className="flex items-start gap-3">
        <span className="mt-0.5">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-[#1D3557] dark:text-slate-100">{label}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
          enabled ? "bg-[#d97757]" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
