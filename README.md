# 📝 NoteFlow — React Notes App

A clean, fully responsive notes application built with **React** and **Tailwind CSS**. Create, edit, delete, and organize your notes with tag filtering, search, and persistent localStorage storage.

---

## 🚀 Features

- **Add Notes** — Create notes with a title, content, and tag
- **Edit Notes** — Update any existing note instantly
- **Delete Notes** — Remove notes with a confirmation step to prevent accidents
- **Search** — Live search filters notes by title or content
- **Tag Filtering** — Filter notes by category: `personal`, `work`, `idea`, or `info`
- **Persistent Storage** — Notes are saved to `localStorage` and survive page refreshes
- **Fully Responsive** — Mobile-first layout with a smooth single-panel navigation flow
- **Word Count** — Each note displays a live word count in the detail view

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Tailwind CSS | Utility-first styling |
| `useState` | Manages notes list, active note, form state, search & filters |
| `useRef` | Auto-focuses the title input when adding or editing a note |
| `useEffect` | Syncs notes to `localStorage` on every change |
| `localStorage` | Persists notes across browser sessions |

---

## 📁 Project Structure
<img width="518" height="797" alt="Screenshot 2026-03-04 062436" src="https://github.com/user-attachments/assets/dc23088a-b858-4b61-b8d8-c8f67cc497fb" />
<img width="1593" height="810" alt="Screenshot 2026-03-04 062022" src="https://github.com/user-attachments/assets/bae0e2a1-4e62-453d-a348-e2a41ab863bd" />

```
src/
├── App.jsx          # Root component (mount NotesApp here)
├── NotesApp.jsx     # Main Notes App component
└── index.css        # Tailwind base styles
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn

### Installation

```bash
# 1. Create a new React project (if you don't have one)
npx create-react-app noteflow
cd noteflow

# 2. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configure Tailwind

In `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

In `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Add the Component

Copy `NotesApp.jsx` into your `src/` folder, then update `src/App.jsx`:

```jsx
import NotesApp from "./NotesApp";

export default function App() {
  return <NotesApp />;
}
```

### Run the App

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Responsive Layout

The app uses a **mobile-first, single-panel navigation** approach:

| Screen | Behaviour |
|---|---|
| Mobile | Shows one panel at a time — List → Detail → Form. Back button in header to navigate. Floating `+` button fixed at bottom-right. |
| Tablet / Desktop | Larger padding, centered `max-w-2xl` content area, same single-panel flow. |

---

## 🧠 React Concepts Used

### `useState`
Manages all dynamic state:
- `notes` — the full list of notes
- `activeNote` — the currently selected note
- `view` — which panel is shown (`"list"`, `"detail"`, or `"form"`)
- `form` — controlled inputs for title, content, and tag
- `search` and `filterTag` — live search and filter values

### `useRef`
`titleRef` is attached to the title `<input>` in the form. Whenever the form view opens (add or edit), a `useEffect` calls `titleRef.current.focus()` to place the cursor automatically.

### `useEffect`
Two effects are used:
1. **Persist to localStorage** — runs on every `notes` change and calls `localStorage.setItem`.
2. **Auto-focus title** — runs when `view` changes to `"form"` and focuses the title input via `useRef`.

---

## 🏷️ Note Tags

Each note can be assigned one of four tags:

| Tag | Color |
|---|---|
| `personal` | Rose / Pink |
| `work` | Sky / Blue |
| `idea` | Violet / Purple |
| `info` | Amber / Yellow |

---

## 💾 localStorage

Notes are stored under the key `noteflow-v2` in the browser's `localStorage`. They are automatically loaded on app start and saved on every change.

To clear all saved notes, run this in your browser console:

```js
localStorage.removeItem("noteflow-v2");
```

---

## 📸 App Flow

```
List View
  ├── Tap a note    →  Detail View
  │                      ├── Edit button  →  Form View (edit mode)
  │                      └── Delete button →  Confirm → deleted, back to List
  └── Tap "+ New"   →  Form View (add mode)
                           └── Save  →  Detail View of new note
```

---

## 📄 License

This project is open source and free to use for personal and educational purposes.
