# ✅ LocalTasker

A lightweight yet powerful **ToDo application** built with **ReactJS** that helps users manage their daily tasks efficiently. LocalTasker goes beyond a basic todo app — featuring priority levels, categories, due dates, dark mode, live search, multi-filtering, and persistent local storage.

---

## 📬 Submission Links

| | Link |
|---|---|
| 🌐 **Hosted Link** | [Click here](https://eloquent-lamington-4277eb.netlify.app/) |
| 🐙 **GitHub Repository** | [Click here](https://github.com/Vihanga-Ops/-LocalTasker.git) |

---

## 📸 Preview

> A clean, responsive task manager with dark mode, priority color-coding, category tags, due date warnings, and a live stats dashboard.

---

## ✨ Features

### ✅ Core Features (Base Requirements)
| Feature | Description |
|---|---|
| **Add Task** | Enter a task description and press Enter or click "Add Task" |
| **Delete Task** | Remove any task instantly with the 🗑️ button |
| **Mark Complete** | Click the checkbox to apply a strikethrough and fade effect |
| **Local Storage** | All tasks auto-save to the browser — persists on refresh or close |
| **Clear Completed** | One-click button to remove all completed tasks at once |

### 🚀 Extra Features Added
| Feature | Description |
|---|---|
| **Priority Levels** | Assign Low / Medium / High priority — color-coded left border (green / amber / red) |
| **Categories** | Tag tasks as Personal, Work, Shopping, Health, Study, or Other |
| **Due Dates** | Set a due date — overdue tasks automatically show a red ⚠️ warning |
| **Notes** | Add optional extra notes/details to any task |
| **Pin Tasks** | 📌 Pin important tasks — they always stay at the top of the list |
| **Inline Edit** | ✏️ Edit any task's title directly without deleting and re-adding it |
| **Live Search** | Search across task titles and notes in real time as you type |
| **Multi-Filter** | Filter simultaneously by Status (Active / Completed / Overdue) + Category + Priority |
| **Sort Options** | Sort tasks by Newest, Oldest, Priority, Due Date, or A→Z |
| **Progress Bar** | Visual progress bar showing the percentage of tasks completed |
| **Stats Dashboard** | Toggleable panel showing task counts by status and category |
| **Dark Mode** | Full dark/light theme toggle — preference saved to localStorage |

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| **ReactJS** | UI components and application logic |
| **React useState** | Managing tasks, filters, search, dark mode, and form state |
| **React useEffect** | Syncing tasks and preferences to localStorage on every change |
| **React useRef** | Auto-focusing the task input when the form opens |
| **JavaScript** | Data filtering, sorting, date comparison, and localStorage handling |
| **CSS-in-JS (inline styles)** | All styling written inline for zero external dependencies |

---

## 📂 Project Structure

```
local-tasker/
├── public/
│   └── index.html
├── src/
│   ├── LocalTasker.jsx       # Main app component — all features and UI
│   ├── App.js                # Root component — renders <LocalTasker />
│   ├── index.js              # React entry point
│   └── index.css             # Optional global reset
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vihanga-Ops/-LocalTasker.git
   cd local-tasker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

---

## 🧩 Component Breakdown

### `LocalTasker.jsx`
The single main component that handles everything:

| Section | Description |
|---|---|
| **Header** | App name, task count, Stats toggle, Dark Mode toggle, Add Task button |
| **Progress Bar** | Shows `completed / total` as a percentage with an animated fill |
| **Stats Panel** | Toggleable grid showing total, completed, remaining, overdue, and per-category counts |
| **Add Task Form** | Slide-in form with task title, priority selector, category selector, due date picker, and notes textarea |
| **Search & Filter Bar** | Live search input + status/category/priority chip filters + sort dropdown |
| **Task List** | Renders filtered and sorted task cards |
| **Task Card** | Shows title, notes, priority/category/due date tags, pin/edit/delete actions |

---

## 🔄 How State Works

```jsx
// Core state hooks used
const [tasks, setTasks]               = useState(() => getFromStorage(...)); // all tasks
const [input, setInput]               = useState('');        // new task text
const [priority, setPriority]         = useState('Medium');  // selected priority
const [category, setCategory]         = useState('Personal');// selected category
const [dueDate, setDueDate]           = useState('');        // due date input
const [notes, setNotes]               = useState('');        // notes input
const [search, setSearch]             = useState('');        // live search term
const [filterStatus, setFilterStatus] = useState('All');     // status filter
const [filterCategory, ...]           = useState('All');     // category filter
const [filterPriority, ...]           = useState('All');     // priority filter
const [sortBy, setSortBy]             = useState('newest');  // sort mode
const [editingId, setEditingId]       = useState(null);      // which task is being edited
const [darkMode, setDarkMode]         = useState(...);       // theme preference
```

---

## 💾 Local Storage Keys

| Key | Value |
|---|---|
| `localtasker_tasks` | JSON array of all task objects |
| `localtasker_dark` | Boolean — dark mode preference |

### Task Object Structure
```js
{
  id: 1700000000000,         // timestamp used as unique ID
  text: "Buy groceries",     // task title
  completed: false,          // completion status
  priority: "High",          // "Low" | "Medium" | "High"
  category: "Shopping",      // one of 6 categories
  dueDate: "2024-12-31",     // ISO date string or ""
  notes: "Check the list",   // optional notes string
  createdAt: "2024-...",     // ISO datetime string
  pinned: false,             // pinned to top
}
```

---

## 🎨 Design Tokens

| Token | Value | Usage |
|---|---|---|
| Primary Purple | `#6366f1` | Buttons, checkboxes, progress bar |
| Secondary Purple | `#8b5cf6` | Gradient, category tags |
| High Priority | `#ef4444` | Red border + tag |
| Medium Priority | `#f59e0b` | Amber border + tag |
| Low Priority | `#22c55e` | Green border + tag |
| Overdue Red | `#ef4444` | Overdue warning badge |
| Dark Background | `#0f1117` | Dark mode page bg |
| Dark Card | `#1a1f2e` | Dark mode card bg |

---

## 📝 Assignment Notes

- Built with **ReactJS only** — no external UI or component libraries
- All styling is written as **inline CSS-in-JS** — zero external stylesheet dependencies
- Uses **three React hooks**: `useState`, `useEffect`, and `useRef`
- **No React Router** needed — single page application
- Tasks and dark mode preference both persist via **localStorage**
- Filtering logic applies **all three filters simultaneously** (status + category + priority)
- Pinned tasks always **sort to the top** regardless of the selected sort mode

---

## 👨‍💻 Author

Vihanga Pathirana

---

## 📄 License

This project was created for educational purposes as part of a frontend development assignment.