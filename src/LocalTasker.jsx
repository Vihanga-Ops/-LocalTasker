import { useState, useEffect, useRef } from "react";

const PRIORITIES = ["Low", "Medium", "High"];
const CATEGORIES = ["Personal", "Work", "Shopping", "Health", "Study", "Other"];
const PRIORITY_COLORS = { Low: "#22c55e", Medium: "#f59e0b", High: "#ef4444" };

function getFromStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function LocalTasker() {
  const [tasks, setTasks] = useState(() => getFromStorage("localtasker_tasks", []));
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [darkMode, setDarkMode] = useState(() => getFromStorage("localtasker_dark", false));
  const [showStats, setShowStats] = useState(false);
  const inputRef = useRef(null);

  // Persist tasks
  useEffect(() => {
    localStorage.setItem("localtasker_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("localtasker_dark", JSON.stringify(darkMode));
  }, [darkMode]);

  // Add task
  const addTask = () => {
    if (!input.trim()) return;
    const task = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      priority,
      category,
      dueDate,
      notes,
      createdAt: new Date().toISOString(),
      pinned: false,
    };
    setTasks([task, ...tasks]);
    setInput("");
    setDueDate("");
    setNotes("");
    setPriority("Medium");
    setCategory("Personal");
    setShowForm(false);
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const togglePin = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editText } : t)));
    setEditingId(null);
  };

  // Filter + sort
  const filtered = tasks
    .filter((t) => {
      const matchSearch = t.text.toLowerCase().includes(search.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()));
      const matchStatus =
        filterStatus === "All" ? true :
        filterStatus === "Active" ? !t.completed :
        filterStatus === "Completed" ? t.completed :
        filterStatus === "Overdue" ? isOverdue(t.dueDate, t.completed) : true;
      const matchCat = filterCategory === "All" || t.category === filterCategory;
      const matchPri = filterPriority === "All" || t.priority === filterPriority;
      return matchSearch && matchStatus && matchCat && matchPri;
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "priority") {
        const order = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === "az") return a.text.localeCompare(b.text);
      return 0;
    });

  // Stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.completed)).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const catCounts = CATEGORIES.reduce((acc, c) => {
    acc[c] = tasks.filter((t) => t.category === c).length;
    return acc;
  }, {});

  const d = darkMode;

  return (
    <div style={{
      minHeight: "100vh",
      background: d ? "#0f1117" : "#f0f4ff",
      color: d ? "#e2e8f0" : "#1e293b",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      transition: "background 0.3s, color 0.3s",
    }}>
      {/* Header */}
      <div style={{
        background: d ? "#1a1f2e" : "#ffffff",
        borderBottom: `1px solid ${d ? "#2d3748" : "#e2e8f0"}`,
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem",
          }}>✓</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.3px" }}>LocalTasker</div>
            <div style={{ fontSize: "0.7rem", color: d ? "#94a3b8" : "#64748b" }}>
              {completed}/{total} tasks done
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button onClick={() => setShowStats(!showStats)} style={btnStyle(d, showStats ? "#6366f1" : undefined)}>
            📊 Stats
          </button>
          <button onClick={() => setDarkMode(!d)} style={btnStyle(d)}>
            {d ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button onClick={() => { setShowForm(!showForm); setTimeout(() => inputRef.current?.focus(), 100); }}
            style={{
              ...btnStyle(d),
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", border: "none", fontWeight: 700,
            }}>
            + Add Task
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Progress Bar */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.8rem", color: d ? "#94a3b8" : "#64748b" }}>
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 99, background: d ? "#2d3748" : "#e2e8f0", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              width: `${progress}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        {/* Stats Panel */}
        {showStats && (
          <div style={{
            background: d ? "#1a1f2e" : "#fff",
            border: `1px solid ${d ? "#2d3748" : "#e2e8f0"}`,
            borderRadius: 14, padding: "1.25rem",
            marginBottom: "1.25rem",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem",
          }}>
            {[
              { label: "Total Tasks", value: total, icon: "📋", color: "#6366f1" },
              { label: "Completed", value: completed, icon: "✅", color: "#22c55e" },
              { label: "Remaining", value: total - completed, icon: "⏳", color: "#f59e0b" },
              { label: "Overdue", value: overdue, icon: "🚨", color: "#ef4444" },
              ...CATEGORIES.filter(c => catCounts[c] > 0).map(c => ({
                label: c, value: catCounts[c], icon: "🏷️", color: "#8b5cf6"
              }))
            ].map((s, i) => (
              <div key={i} style={{
                background: d ? "#0f1117" : "#f8fafc",
                borderRadius: 10, padding: "0.85rem",
                borderLeft: `3px solid ${s.color}`,
              }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "0.72rem", color: d ? "#94a3b8" : "#64748b" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Add Task Form */}
        {showForm && (
          <div style={{
            background: d ? "#1a1f2e" : "#fff",
            border: `1px solid ${d ? "#2d3748" : "#e2e8f0"}`,
            borderRadius: 14, padding: "1.25rem",
            marginBottom: "1.25rem",
            boxShadow: "0 4px 20px rgba(99,102,241,0.12)",
          }}>
            <div style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem" }}>New Task</div>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="What needs to be done?"
              style={inputStyle(d, true)}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", margin: "0.75rem 0" }}>
              <div>
                <label style={labelStyle(d)}>Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={inputStyle(d)}>
                  {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle(d)}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle(d)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle(d)}>Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle(d)} />
              </div>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes (optional)..."
              rows={2}
              style={{ ...inputStyle(d), resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={btnStyle(d)}>Cancel</button>
              <button onClick={addTask} style={{
                ...btnStyle(d),
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", border: "none", fontWeight: 700,
              }}>Add Task</button>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div style={{
          background: d ? "#1a1f2e" : "#fff",
          border: `1px solid ${d ? "#2d3748" : "#e2e8f0"}`,
          borderRadius: 14, padding: "1rem",
          marginBottom: "1rem",
        }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search tasks and notes..."
            style={{ ...inputStyle(d, true), marginBottom: "0.75rem" }}
          />
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {/* Status */}
            {["All", "Active", "Completed", "Overdue"].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={chipStyle(d, filterStatus === s)}>{s}</button>
            ))}
            <div style={{ width: 1, background: d ? "#2d3748" : "#e2e8f0", margin: "0 4px" }} />
            {/* Category */}
            {["All", ...CATEGORIES].map((c) => (
              <button key={c} onClick={() => setFilterCategory(c)}
                style={chipStyle(d, filterCategory === c, "#8b5cf6")}>{c}</button>
            ))}
            <div style={{ width: 1, background: d ? "#2d3748" : "#e2e8f0", margin: "0 4px" }} />
            {/* Priority */}
            {["All", ...PRIORITIES].map((p) => (
              <button key={p} onClick={() => setFilterPriority(p)}
                style={chipStyle(d, filterPriority === p, PRIORITY_COLORS[p])}>{p}</button>
            ))}
            <div style={{ marginLeft: "auto" }}>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ ...inputStyle(d), padding: "0.3rem 0.6rem", fontSize: "0.78rem" }}>
                <option value="newest">↓ Newest</option>
                <option value="oldest">↑ Oldest</option>
                <option value="priority">🔥 Priority</option>
                <option value="dueDate">📅 Due Date</option>
                <option value="az">A→Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Count + Clear */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", fontSize: "0.82rem", color: d ? "#94a3b8" : "#64748b" }}>
          <span>{filtered.length} task{filtered.length !== 1 ? "s" : ""}</span>
          {tasks.some((t) => t.completed) && (
            <button onClick={clearCompleted} style={{ ...btnStyle(d), color: "#ef4444", fontSize: "0.78rem" }}>
              🗑️ Clear Completed
            </button>
          )}
        </div>

        {/* Task List */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "3rem",
            color: d ? "#4a5568" : "#94a3b8",
            background: d ? "#1a1f2e" : "#fff",
            borderRadius: 14, border: `1px dashed ${d ? "#2d3748" : "#e2e8f0"}`,
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📭</div>
            <div style={{ fontWeight: 600 }}>No tasks found</div>
            <div style={{ fontSize: "0.8rem", marginTop: 4 }}>Try adjusting your filters or add a new task</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {filtered.map((task) => {
              const overdue = isOverdue(task.dueDate, task.completed);
              return (
                <div key={task.id} style={{
                  background: d ? "#1a1f2e" : "#fff",
                  border: `1px solid ${overdue ? "#ef444440" : task.pinned ? "#6366f140" : d ? "#2d3748" : "#e2e8f0"}`,
                  borderLeft: `4px solid ${overdue ? "#ef4444" : PRIORITY_COLORS[task.priority]}`,
                  borderRadius: 12,
                  padding: "0.9rem 1rem",
                  opacity: task.completed ? 0.65 : 1,
                  transition: "all 0.2s",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    {/* Checkbox */}
                    <button onClick={() => toggleComplete(task.id)} style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 2,
                      border: `2px solid ${task.completed ? "#6366f1" : d ? "#4a5568" : "#cbd5e1"}`,
                      background: task.completed ? "#6366f1" : "transparent",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "0.7rem",
                    }}>
                      {task.completed ? "✓" : ""}
                    </button>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {editingId === task.id ? (
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(task.id); if (e.key === "Escape") setEditingId(null); }}
                            autoFocus
                            style={{ ...inputStyle(d, true), flex: 1 }}
                          />
                          <button onClick={() => saveEdit(task.id)} style={{ ...btnStyle(d), color: "#6366f1", fontWeight: 700 }}>Save</button>
                          <button onClick={() => setEditingId(null)} style={btnStyle(d)}>✕</button>
                        </div>
                      ) : (
                        <div style={{
                          fontWeight: 600, fontSize: "0.92rem",
                          textDecoration: task.completed ? "line-through" : "none",
                          color: task.completed ? (d ? "#4a5568" : "#94a3b8") : d ? "#e2e8f0" : "#1e293b",
                          wordBreak: "break-word",
                        }}>{task.text}</div>
                      )}

                      {task.notes && (
                        <div style={{ fontSize: "0.78rem", color: d ? "#94a3b8" : "#64748b", marginTop: 4 }}>
                          📝 {task.notes}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: 6, alignItems: "center" }}>
                        <span style={tagStyle(PRIORITY_COLORS[task.priority])}>{task.priority}</span>
                        <span style={tagStyle("#8b5cf6")}>🏷️ {task.category}</span>
                        {task.dueDate && (
                          <span style={tagStyle(overdue ? "#ef4444" : "#64748b")}>
                            📅 {overdue ? "⚠️ " : ""}{formatDate(task.dueDate)}
                          </span>
                        )}
                        {task.pinned && <span style={tagStyle("#f59e0b")}>📌 Pinned</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "0.3rem", flexShrink: 0 }}>
                      <button onClick={() => togglePin(task.id)} title="Pin" style={iconBtn(d, task.pinned ? "#f59e0b" : undefined)}>📌</button>
                      <button onClick={() => { setEditingId(task.id); setEditText(task.text); }} title="Edit" style={iconBtn(d)}>✏️</button>
                      <button onClick={() => deleteTask(task.id)} title="Delete" style={iconBtn(d, "#ef4444")}>🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Style helpers
function inputStyle(dark, full) {
  return {
    width: full ? "100%" : "auto",
    padding: "0.55rem 0.75rem",
    borderRadius: 8,
    border: `1px solid ${dark ? "#2d3748" : "#e2e8f0"}`,
    background: dark ? "#0f1117" : "#f8fafc",
    color: dark ? "#e2e8f0" : "#1e293b",
    fontSize: "0.88rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };
}

function btnStyle(dark, bg) {
  return {
    padding: "0.4rem 0.85rem",
    borderRadius: 8,
    border: `1px solid ${dark ? "#2d3748" : "#e2e8f0"}`,
    background: bg || (dark ? "#1a1f2e" : "#f8fafc"),
    color: dark ? "#e2e8f0" : "#374151",
    cursor: "pointer",
    fontSize: "0.82rem",
    fontFamily: "inherit",
    transition: "all 0.15s",
  };
}

function chipStyle(dark, active, color = "#6366f1") {
  return {
    padding: "0.3rem 0.7rem",
    borderRadius: 99,
    border: `1px solid ${active ? color : dark ? "#2d3748" : "#e2e8f0"}`,
    background: active ? `${color}20` : "transparent",
    color: active ? color : dark ? "#94a3b8" : "#64748b",
    cursor: "pointer",
    fontSize: "0.78rem",
    fontFamily: "inherit",
    fontWeight: active ? 700 : 400,
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  };
}

function tagStyle(color) {
  return {
    fontSize: "0.7rem",
    padding: "0.15rem 0.5rem",
    borderRadius: 99,
    background: `${color}18`,
    color: color,
    fontWeight: 600,
    border: `1px solid ${color}30`,
  };
}

function iconBtn(dark, color) {
  return {
    width: 30, height: 30,
    borderRadius: 7,
    border: `1px solid ${dark ? "#2d3748" : "#e2e8f0"}`,
    background: dark ? "#0f1117" : "#f8fafc",
    cursor: "pointer",
    fontSize: "0.8rem",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: color || "inherit",
    transition: "all 0.15s",
  };
}

function labelStyle(dark) {
  return {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 600,
    color: dark ? "#94a3b8" : "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };
}