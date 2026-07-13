import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

export default function TaskDescriptionCard({ description }) {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-[#1e293b] p-5 shadow-sm w-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-[#d97757]/10 rounded-lg p-1.5">
          <DescriptionRoundedIcon sx={{ color: "#d97757", fontSize: "1.1rem" }} />
        </div>
        <h2 className="text-sm font-bold text-[#1D3557] dark:text-slate-100">Description</h2>
      </div>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap max-h-32 overflow-y-auto pr-1">
        {description?.trim()
          ? description
          : "No description provided for this task."}
      </p>
    </div>
  );
}
