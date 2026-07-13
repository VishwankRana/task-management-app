import { useState, useEffect } from "react";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { IconButton } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import { useChecklist } from "../../hooks/useChecklist";

function ProgressBar({ percent }) {
  return (
    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
      <div
        className="h-full rounded-full bg-[#d97757] transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function ChecklistRow({ item, isPending, onToggle, onUpdateText, onDelete }) {
  const { isDark } = useTheme();
  const [draft, setDraft] = useState(item.text);

  useEffect(() => {
    setDraft(item.text);
  }, [item.text]);

  const handleBlur = () => {
    if (draft.trim() !== item.text) {
      onUpdateText(item.id, draft);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border border-slate-100 dark:border-slate-600/50 bg-slate-50 dark:bg-[#263446] px-3 py-2.5 transition-opacity ${
        isPending ? "opacity-60" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={item.isCompleted}
        onChange={() => onToggle(item.id)}
        disabled={isPending || item._optimistic}
        className="h-4 w-4 shrink-0 accent-[#d97757] cursor-pointer"
        aria-label={`Mark "${item.text}" as ${item.isCompleted ? "incomplete" : "complete"}`}
      />
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        className={`flex-1 min-w-0 bg-transparent text-sm text-[#1D3557] dark:text-slate-100 focus:outline-none ${
          item.isCompleted ? "line-through text-slate-400 dark:text-slate-500" : ""
        }`}
      />
      <IconButton
        size="small"
        onClick={() => onDelete(item.id)}
        disabled={isPending || item._optimistic}
        aria-label="Delete checklist item"
        sx={{
          color: isDark ? "#94a3b8" : "#64748b",
          "&:hover": { color: "#d97757", bgcolor: isDark ? "#431407" : "#fee2e2" },
        }}
      >
        <DeleteOutlineRoundedIcon fontSize="small" />
      </IconButton>
    </div>
  );
}

export default function TaskChecklistSection({ taskId }) {
  const {
    items,
    loading,
    progress,
    pendingIds,
    addItem,
    toggleItem,
    updateItemText,
    deleteItem,
  } = useChecklist(taskId);

  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e?.preventDefault();
    const trimmed = newText.trim();
    if (!trimmed) return;

    setAdding(true);
    const ok = await addItem(trimmed);
    if (ok) {
      setNewText("");
    }
    setAdding(false);
  };

  const handleNewKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd(e);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-[#1e293b] p-5 shadow-sm w-full h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <div className="bg-[#d97757]/10 rounded-lg p-1.5">
          <ChecklistRoundedIcon sx={{ color: "#d97757", fontSize: "1.1rem" }} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#1D3557] dark:text-slate-100">Checklist</h2>
          {progress.total > 0 && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {progress.completed} / {progress.total} completed
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4 mb-3">
          Loading checklist...
        </p>
      ) : progress.total === 0 ? (
        <div className="flex-1 rounded-xl bg-slate-50 dark:bg-[#263446] border border-dashed border-slate-200 dark:border-slate-600 px-4 py-4 text-center flex items-center justify-center mb-3">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            No checklist items yet.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Break this task into smaller steps.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col mb-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 shrink-0">
            <span>Progress</span>
            <span className="font-semibold">{progress.percent}%</span>
          </div>
          <ProgressBar percent={progress.percent} />
          <div className="flex-1 min-h-0 max-h-[10rem] overflow-y-auto pr-1 space-y-2 mt-3">
            {items.map((item) => (
              <ChecklistRow
                key={item.id}
                item={item}
                isPending={pendingIds.has(item.id)}
                onToggle={toggleItem}
                onUpdateText={updateItemText}
                onDelete={deleteItem}
              />
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleAdd} className="flex items-center gap-2 shrink-0 border-t border-slate-100 dark:border-slate-700 pt-3 mt-auto">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={handleNewKeyDown}
          placeholder="Add a checklist item..."
          maxLength={200}
          disabled={adding}
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-[#263446] px-4 py-2.5 text-sm text-[#1D3557] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#d97757]/40"
        />
        <button
          type="submit"
          disabled={adding || !newText.trim()}
          className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-[#d97757] text-white text-sm font-semibold hover:bg-[#c4664a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <AddRoundedIcon sx={{ fontSize: "1rem" }} />
          {adding ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
}
