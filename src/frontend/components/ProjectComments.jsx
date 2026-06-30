import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IconButton } from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

dayjs.extend(relativeTime);

export default function ProjectComments({ projectId, projectName }) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/taskmanager/projects/${projectId}/comments`
        );
        setComments([...res.data].reverse());
        setLoaded(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [projectId]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/taskmanager/projects/${projectId}/comments`,
        { content: trimmed }
      );
      setComments((prev) => [...prev, res.data]);
      setContent("");
      toast.success("Comment posted");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error ?? "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#263446] text-[#1D3557] dark:text-slate-100 text-sm font-semibold shadow-sm hover:shadow-md hover:border-[#d97757]/50 dark:hover:border-[#d97757]/50 transition-all"
        aria-label="Open project comments"
      >
        <ChatBubbleOutlineRoundedIcon sx={{ color: "#d97757", fontSize: "1.25rem" }} />
        <span>Comments</span>
        {loaded && comments.length > 0 && (
          <span className="min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-[#d97757] text-white text-xs font-bold">
            {comments.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />

          <aside
            ref={panelRef}
            className="relative flex flex-col w-full max-w-sm h-full bg-white dark:bg-[#1e293b] shadow-2xl border-l border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-2 px-4 py-4 border-b border-slate-100 dark:border-slate-700 shrink-0">
              <ChatBubbleOutlineRoundedIcon sx={{ color: "#d97757", fontSize: "1.35rem" }} />
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-[#1D3557] dark:text-slate-100">
                  Project Comments
                </h2>
                {projectName && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                    {projectName}
                  </p>
                )}
              </div>
              <IconButton
                onClick={() => setOpen(false)}
                size="small"
                aria-label="Close comments"
                sx={{ color: isDark ? "#94a3b8" : "#64748b" }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {loading ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
                  Loading comments...
                </p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
                  No comments yet. Be the first to share an update.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-xl bg-slate-50 dark:bg-[#263446] px-4 py-3 border border-slate-100 dark:border-slate-600/50"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-[#1D3557] dark:text-slate-100 truncate">
                        {comment.authorName}
                        {comment.userId === user?.id && (
                          <span className="ml-1.5 text-xs font-medium text-[#d97757]">(you)</span>
                        )}
                      </span>
                      <time
                        className="text-xs text-slate-400 dark:text-slate-500 shrink-0"
                        title={dayjs(comment.createdAt).format("MMM D, YYYY h:mm A")}
                      >
                        {dayjs(comment.createdAt).fromNow()}
                      </time>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="px-4 py-4 border-t border-slate-100 dark:border-slate-700 shrink-0"
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share an update about this project..."
                rows={3}
                maxLength={1000}
                className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-[#263446] px-4 py-3 text-sm text-[#1D3557] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#d97757]/40"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {content.length}/1000
                </span>
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="px-4 py-2 rounded-xl bg-[#d97757] text-white text-sm font-semibold hover:bg-[#c4664a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
