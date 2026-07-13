import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api, { API_TASKMANAGER } from "../utils/api.js";

const API_BASE = `${API_TASKMANAGER}/tasks`;

export function useChecklist(taskId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState(new Set());

  const fetchItems = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const res = await api.get(`${API_BASE}/${taskId}/checklist`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load checklist");
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const progress = useMemo(() => {
    const total = items.length;
    const completed = items.filter((item) => item.isCompleted).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent };
  }, [items]);

  const markPending = (id, isPending) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (isPending) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const addItem = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    const optimistic = {
      id: `temp-${Date.now()}`,
      taskId,
      text: trimmed,
      isCompleted: false,
      order: items.length,
      _optimistic: true,
    };

    setItems((prev) => [...prev, optimistic]);

    try {
      const res = await api.post(`${API_BASE}/${taskId}/checklist`, { text: trimmed });
      setItems((prev) => prev.map((item) => (item.id === optimistic.id ? res.data : item)));
      return true;
    } catch (err) {
      setItems((prev) => prev.filter((item) => item.id !== optimistic.id));
      toast.error(err.response?.data?.error ?? "Failed to add checklist item");
      return false;
    }
  };

  const toggleItem = async (itemId) => {
    const existing = items.find((item) => item.id === itemId);
    if (!existing || String(itemId).startsWith("temp-")) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
    markPending(itemId, true);

    try {
      const res = await api.patch(`${API_BASE}/${taskId}/checklist/${itemId}/toggle`);
      setItems((prev) => prev.map((item) => (item.id === itemId ? res.data : item)));
    } catch (err) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, isCompleted: existing.isCompleted } : item
        )
      );
      toast.error(err.response?.data?.error ?? "Failed to update checklist item");
    } finally {
      markPending(itemId, false);
    }
  };

  const updateItemText = async (itemId, text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      toast.error("Checklist item text cannot be empty");
      return false;
    }

    const existing = items.find((item) => item.id === itemId);
    if (!existing || existing.text === trimmed) return true;

    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, text: trimmed } : item))
    );
    markPending(itemId, true);

    try {
      const res = await api.put(`${API_BASE}/${taskId}/checklist/${itemId}`, { text: trimmed });
      setItems((prev) => prev.map((item) => (item.id === itemId ? res.data : item)));
      return true;
    } catch (err) {
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, text: existing.text } : item))
      );
      toast.error(err.response?.data?.error ?? "Failed to update checklist item");
      return false;
    } finally {
      markPending(itemId, false);
    }
  };

  const deleteItem = async (itemId) => {
    const existing = items.find((item) => item.id === itemId);
    if (!existing) return;

    setItems((prev) => prev.filter((item) => item.id !== itemId));
    markPending(itemId, true);

    try {
      await api.delete(`${API_BASE}/${taskId}/checklist/${itemId}`);
      toast.success("Checklist item removed");
    } catch (err) {
      setItems((prev) => {
        const restored = [...prev, existing].sort((a, b) => a.order - b.order);
        return restored;
      });
      toast.error(err.response?.data?.error ?? "Failed to delete checklist item");
    } finally {
      markPending(itemId, false);
    }
  };

  return {
    items,
    loading,
    progress,
    pendingIds,
    addItem,
    toggleItem,
    updateItemText,
    deleteItem,
    refetch: fetchItems,
  };
}
