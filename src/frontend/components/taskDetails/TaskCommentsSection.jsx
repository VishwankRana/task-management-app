import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api.js";

dayjs.extend(relativeTime);

export default function TaskCommentsSection({ taskId, taskTitle }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/taskmanager/tasks/${taskId}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const res = await api.post(
        `/api/taskmanager/tasks/${taskId}/comments`,
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
    <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-[#1e293b] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="bg-[#d97757]/10 rounded-lg p-1.5 shrink-0">
            <ChatBubbleOutlineRoundedIcon sx={{ color: "#d97757", fontSize: "1.1rem" }} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-[#1D3557] dark:text-slate-100">
              Task Comments
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
              Notes on {taskTitle ? `"${taskTitle}"` : "this task"}
            </p>
          </div>
        </div>
        {comments.length > 0 && (
          <span className="min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-[#d97757] text-white text-xs font-bold shrink-0">
            {comments.length}
          </span>
        )}
      </div>

      <div className="space-y-3 my-4 max-h-72 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <div className="rounded-xl bg-slate-50 dark:bg-[#263446] border border-dashed border-slate-200 dark:border-slate-600 px-4 py-8 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              No comments yet. Be the first to leave a note.
            </p>
          </div>
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
        className="border-t border-slate-100 dark:border-slate-700 pt-4"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment about this task..."
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d97757] text-white text-sm font-semibold hover:bg-[#c4664a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <SendRoundedIcon sx={{ fontSize: "1rem" }} />
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>
    </div>
  );
}
