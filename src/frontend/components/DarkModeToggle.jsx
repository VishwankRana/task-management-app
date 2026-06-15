import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold
        transition-all duration-200 cursor-pointer select-none
        ${isDark
          ? "bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600"
          : "bg-[#f0f4ff] border-[#d0d9f0] text-[#1D3557] hover:bg-[#e8f0ff]"
        }
      `}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark
        ? <Sun size={15} className="text-yellow-400 shrink-0" />
        : <Moon size={15} className="text-[#1D3557] shrink-0" />
      }
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
