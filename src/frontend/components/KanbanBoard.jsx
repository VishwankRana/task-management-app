import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CircularProgress } from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import KanbanTaskCard from "./KanbanTaskCard";

export const BOARD_COLUMNS = [
  {
    id: "Pending",
    label: "Pending",
    headerClass: "border-yellow-400/60 dark:border-yellow-500/50 bg-[#fff7d6] dark:bg-yellow-500/15",
    badgeClass: "bg-[#c7a10a] dark:bg-yellow-600 text-white",
    dropHighlight: "ring-2 ring-yellow-400/50 bg-yellow-50/80 dark:bg-yellow-500/10",
  },
  {
    id: "In-progress",
    label: "In Progress",
    headerClass: "border-violet-400/60 dark:border-violet-500/50 bg-[#eef1f6] dark:bg-violet-500/15",
    badgeClass: "bg-[#6b7280] dark:bg-violet-600 text-white",
    dropHighlight: "ring-2 ring-violet-400/50 bg-violet-50/80 dark:bg-violet-500/10",
  },
  {
    id: "Completed",
    label: "Completed",
    headerClass: "border-green-400/60 dark:border-green-500/50 bg-[#e9f7ec] dark:bg-green-500/15",
    badgeClass: "bg-[#2a7a35] dark:bg-green-600 text-white",
    dropHighlight: "ring-2 ring-green-400/50 bg-green-50/80 dark:bg-green-500/10",
  },
  {
    id: "Cancelled",
    label: "Cancelled",
    headerClass: "border-red-400/60 dark:border-red-500/50 bg-red-50 dark:bg-red-500/15",
    badgeClass: "bg-red-600 dark:bg-red-700 text-white",
    dropHighlight: "ring-2 ring-red-400/50 bg-red-50/80 dark:bg-red-500/10",
  },
];

function getTaskId(task) {
  return String(task.id ?? task._id);
}

function getColumnTasks(tasks, columnId) {
  return tasks.filter((t) => (t.status || "Pending") === columnId);
}

function reorderColumnTasks(tasks, columnId, sourceIndex, destIndex) {
  const columnTasks = getColumnTasks(tasks, columnId);
  const otherTasks = tasks.filter((t) => (t.status || "Pending") !== columnId);
  const [moved] = columnTasks.splice(sourceIndex, 1);
  columnTasks.splice(destIndex, 0, moved);
  return [...otherTasks, ...columnTasks];
}

export default function KanbanBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/taskmanager/projects/${projectId}/tasks`
      );
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load board tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;
    const previousTasks = tasks;

    if (sourceStatus === destStatus) {
      setTasks((prev) => reorderColumnTasks(prev, sourceStatus, source.index, destination.index));
      return;
    }

    const task = tasks.find((t) => getTaskId(t) === draggableId);
    if (!task) return;

    setTasks((prev) =>
      prev.map((t) =>
        getTaskId(t) === draggableId ? { ...t, status: destStatus } : t
      )
    );

    try {
      await axios.put(`http://localhost:3000/api/taskmanager/tasks/${draggableId}`, {
        status: destStatus,
      });
    } catch (err) {
      console.error(err);
      setTasks(previousTasks);
      toast.error(err.response?.data?.message ?? "Failed to update task status");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <CircularProgress size={40} sx={{ color: "#d97757" }} />
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading board…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <ErrorOutlineRoundedIcon sx={{ fontSize: "2.5rem", color: "#d97757" }} />
        <p className="text-sm text-gray-600 dark:text-slate-400 max-w-sm">{error}</p>
        <button
          type="button"
          onClick={fetchTasks}
          className="px-4 py-2 rounded-xl bg-[#d97757] text-white text-sm font-semibold hover:bg-[#c4664a] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="overflow-x-auto pb-4 -mx-1 px-1">
        <div className="flex gap-4 min-w-max">
          {BOARD_COLUMNS.map((column) => {
            const columnTasks = getColumnTasks(tasks, column.id);

            return (
              <div
                key={column.id}
                className="w-72 shrink-0 flex flex-col max-h-[calc(100vh-16rem)]"
              >
                <div
                  className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl border-b-2 ${column.headerClass}`}
                >
                  <h3 className="text-sm font-bold text-[#1D3557] dark:text-slate-100">
                    {column.label}
                  </h3>
                  <span
                    className={`min-w-[1.5rem] h-6 px-2 flex items-center justify-center rounded-full text-xs font-bold ${column.badgeClass}`}
                  >
                    {columnTasks.length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`
                        flex-1 overflow-y-auto rounded-b-xl border border-t-0
                        border-slate-200 dark:border-slate-700
                        bg-slate-50/80 dark:bg-[#0f172a]/40
                        p-2 space-y-2 min-h-[12rem]
                        transition-all duration-200
                        ${snapshot.isDraggingOver ? column.dropHighlight : ""}
                      `}
                    >
                      {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                        <p className="text-xs text-center text-gray-400 dark:text-slate-500 py-8 px-2">
                          Drop tasks here
                        </p>
                      )}

                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={getTaskId(task)}
                          draggableId={getTaskId(task)}
                          index={index}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              style={dragProvided.draggableProps.style}
                              className="transition-shadow duration-200"
                            >
                              <KanbanTaskCard
                                task={task}
                                isDragging={dragSnapshot.isDragging}
                                dragHandleProps={dragProvided.dragHandleProps}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
}
