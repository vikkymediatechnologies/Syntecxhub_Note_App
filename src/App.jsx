import { useState, useRef, useEffect } from "react";

/* ─── Constants ─────────────────────────────────────────────────── */
const INITIAL_NOTES = [
  {
    id: 1,
    title: "Welcome to NoteFlow ✨",
    content: "Tap any note to read it. Hit Edit to modify, or press + to create a new one.",
    tag: "info",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Grocery List 🛒",
    content: "- Avocados\n- Greek yogurt\n- Sourdough bread\n- Cherry tomatoes\n- Sparkling water",
    tag: "personal",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: "Project Ideas 💡",
    content: "1. Build a habit tracker\n2. Create a recipe organizer\n3. Design a budget planner\n4. Develop a reading list app",
    tag: "work",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const TAG_STYLES = {
  personal: { bg: "bg-rose-500/10 text-rose-400 border-rose-500/20", dot: "bg-rose-400" },
  work:     { bg: "bg-sky-500/10 text-sky-400 border-sky-500/20",     dot: "bg-sky-400" },
  info:     { bg: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
  idea:     { bg: "bg-violet-500/10 text-violet-400 border-violet-500/20", dot: "bg-violet-400" },
};
const TAGS = ["personal", "work", "idea", "info"];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function getStorage() {
  try { const s = localStorage.getItem("noteflow-v2"); return s ? JSON.parse(s) : INITIAL_NOTES; }
  catch { return INITIAL_NOTES; }
}
function setStorage(n) {
  try { localStorage.setItem("noteflow-v2", JSON.stringify(n)); } catch {}
}

/* ─── Main App ───────────────────────────────────────────────────── */
export default function NotesApp() {
  const [notes, setNotes]             = useState(() => getStorage());
  const [activeNote, setActiveNote]   = useState(null);
  const [view, setView]               = useState("list"); // "list" | "detail" | "form"
  const [formMode, setFormMode]       = useState("add"); // "add" | "edit"
  const [form, setForm]               = useState({ title: "", content: "", tag: "personal" });
  const [search, setSearch]           = useState("");
  const [filterTag, setFilterTag]     = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const titleRef  = useRef(null);
  const searchRef = useRef(null);

  // Persist on every notes change
  useEffect(() => { setStorage(notes); }, [notes]);

  // Auto-focus title when form opens
  useEffect(() => {
    if (view === "form") setTimeout(() => titleRef.current?.focus(), 80);
  }, [view]);

  const filtered = notes.filter(n => {
    const q = search.toLowerCase();
    return (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      && (filterTag === "all" || n.tag === filterTag);
  });

  function openNote(note) {
    setActiveNote(note);
    setDeleteConfirm(false);
    setView("detail");
  }

  function openAdd() {
    setForm({ title: "", content: "", tag: "personal" });
    setFormMode("add");
    setView("form");
  }

  function openEdit() {
    setForm({ title: activeNote.title, content: activeNote.content, tag: activeNote.tag });
    setFormMode("edit");
    setView("form");
  }

  function saveNote() {
    if (!form.title.trim()) return;
    if (formMode === "add") {
      const n = { id: Date.now(), ...form, title: form.title.trim(), content: form.content.trim(), createdAt: new Date().toISOString() };
      const updated = [n, ...notes];
      setNotes(updated);
      setActiveNote(n);
      setView("detail");
    } else {
      const updated = notes.map(n => n.id === activeNote.id ? { ...n, ...form, title: form.title.trim(), content: form.content.trim() } : n);
      setNotes(updated);
      setActiveNote(updated.find(n => n.id === activeNote.id));
      setView("detail");
    }
  }

  function deleteNote() {
    const updated = notes.filter(n => n.id !== activeNote.id);
    setNotes(updated);
    setActiveNote(null);
    setView("list");
    setDeleteConfirm(false);
  }

  function goBack() {
    if (view === "form" && formMode === "edit") { setView("detail"); return; }
    if (view === "form" && formMode === "add")  { setView("list"); return; }
    setView("list");
  }

  const tagStyle = (tag) => TAG_STYLES[tag] || { bg: "bg-zinc-700/40 text-zinc-400 border-zinc-600", dot: "bg-zinc-400" };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: "100vw" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        .note-row { transition: background 0.12s ease, transform 0.12s ease; }
        .note-row:hover { background: rgba(255,255,255,0.04); }
        .note-row:active { background: rgba(255,255,255,0.07); transform: scale(0.99); }
        .tag-chip { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; border-radius: 99px; padding: 2px 8px; border-width: 1px; border-style: solid; }
        .btn { transition: all 0.12s ease; cursor: pointer; border: none; outline: none; }
        .btn:active { transform: scale(0.96); }
        .fade { animation: fadeUp 0.18s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
        .slide-in { animation: slideIn 0.22s cubic-bezier(.4,0,.2,1) both; }
        @keyframes slideIn { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }
        input, textarea { -webkit-appearance: none; }
      `}</style>

      {/* ══════════════ HEADER ══════════════ */}
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-zinc-950 border-b border-zinc-800/80" style={{ minHeight: 56 }}>
        {view !== "list" ? (
          <button onClick={goBack} className="btn w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-300 shrink-0">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-sm font-bold shadow shadow-indigo-500/40 shrink-0">N</div>
        )}

        <span className="font-bold text-base flex-1 truncate" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.3px" }}>
          {view === "list"   && "NoteFlow"}
          {view === "detail" && (activeNote?.title || "Note")}
          {view === "form"   && (formMode === "add" ? "New Note" : "Edit Note")}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          {view === "list" && (
            <>
              <span className="text-xs text-zinc-600 hidden sm:inline">{notes.length} notes</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 hidden sm:block" title="Saved" />
              <button onClick={openAdd} className="btn flex items-center gap-1 bg-indigo-500 text-white text-xs font-semibold rounded-xl px-3 py-2 shadow shadow-indigo-500/30">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                <span className="hidden sm:inline">New Note</span>
                <span className="sm:hidden">New</span>
              </button>
            </>
          )}
          {view === "detail" && (
            <div className="flex gap-2">
              <button onClick={openEdit} className="btn bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl px-3 py-2">
                Edit
              </button>
              {!deleteConfirm ? (
                <button onClick={() => setDeleteConfirm(true)} className="btn bg-zinc-800 text-red-400 text-xs font-semibold rounded-xl px-3 py-2">
                  Delete
                </button>
              ) : (
                <div className="flex gap-1">
                  <button onClick={deleteNote} className="btn bg-red-500 text-white text-xs font-semibold rounded-xl px-3 py-2">Sure?</button>
                  <button onClick={() => setDeleteConfirm(false)} className="btn bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl px-3 py-2">No</button>
                </div>
              )}
            </div>
          )}
          {view === "form" && (
            <button
              onClick={saveNote}
              disabled={!form.title.trim()}
              className="btn bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl px-4 py-2 shadow shadow-indigo-500/30"
            >
              {formMode === "add" ? "Add" : "Save"}
            </button>
          )}
        </div>
      </header>

      {/* ══════════════ CONTENT ══════════════ */}
      <div className="flex-1 overflow-hidden flex">

        {/* ── LIST VIEW ─────────────────────── */}
        {view === "list" && (
          <div className="fade flex-1 flex flex-col overflow-hidden">

            {/* Search + Filter */}
            <div className="px-4 pt-3 pb-2 space-y-2 bg-zinc-950 border-b border-zinc-800/60">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  ref={searchRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="btn absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
                {["all", ...TAGS].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterTag(t)}
                    className={`btn tag-chip shrink-0 ${filterTag === t ? "bg-indigo-500 text-white border-indigo-500" : "bg-zinc-900 text-zinc-500 border-zinc-700"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 px-6 text-center">
                  <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-2xl">📋</div>
                  <p className="text-zinc-400 font-semibold">{search ? `No results for "${search}"` : "No notes yet"}</p>
                  {!search && <button onClick={openAdd} className="btn bg-indigo-500 text-white text-sm font-semibold rounded-xl px-5 py-2.5 mt-1">Create your first note</button>}
                </div>
              ) : (
                <ul className="divide-y divide-zinc-800/60">
                  {filtered.map(note => (
                    <li key={note.id}>
                      <button
                        onClick={() => openNote(note)}
                        className="note-row w-full text-left px-4 py-3.5 flex items-start gap-3"
                      >
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${tagStyle(note.tag).dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-zinc-100 truncate">{note.title}</p>
                            <span className="text-xs text-zinc-600 shrink-0">{formatDate(note.createdAt)}</span>
                          </div>
                          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{note.content || "No content"}</p>
                          <span className={`tag-chip mt-1.5 inline-block ${tagStyle(note.tag).bg}`}>{note.tag}</span>
                        </div>
                        <svg className="mt-1 shrink-0 text-zinc-700" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Mobile FAB */}
            <button onClick={openAdd} className="btn fixed bottom-6 right-5 sm:hidden w-14 h-14 rounded-full bg-indigo-500 shadow-xl shadow-indigo-500/40 flex items-center justify-center text-white text-2xl z-40">
              +
            </button>
          </div>
        )}

        {/* ── DETAIL VIEW ───────────────────── */}
        {view === "detail" && activeNote && (
          <div className="slide-in flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-8">
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`tag-chip ${tagStyle(activeNote.tag).bg}`}>{activeNote.tag}</span>
                <span className="text-xs text-zinc-600">{formatDate(activeNote.createdAt)}</span>
                <span className="text-xs text-zinc-700">·</span>
                <span className="text-xs text-zinc-600">{activeNote.content.trim().split(/\s+/).filter(Boolean).length} words</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-zinc-50 mb-5 leading-snug" style={{ fontFamily: "'Syne', sans-serif" }}>
                {activeNote.title}
              </h1>

              <div className="bg-zinc-900 rounded-2xl p-4 sm:p-6 border border-zinc-800">
                {activeNote.content ? (
                  <pre className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {activeNote.content}
                  </pre>
                ) : (
                  <p className="text-zinc-600 italic text-sm">This note is empty.</p>
                )}
              </div>

              {deleteConfirm && (
                <div className="mt-4 bg-red-950/40 border border-red-800/40 rounded-2xl p-4 text-center fade">
                  <p className="text-sm text-red-300 font-semibold mb-3">Delete this note permanently?</p>
                  <div className="flex gap-2 justify-center">
                    <button onClick={deleteNote} className="btn bg-red-500 text-white text-sm font-semibold rounded-xl px-5 py-2">Yes, Delete</button>
                    <button onClick={() => setDeleteConfirm(false)} className="btn bg-zinc-800 text-zinc-300 text-sm font-semibold rounded-xl px-5 py-2">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FORM VIEW ─────────────────────── */}
        {view === "form" && (
          <div className="slide-in flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-8">
            <div className="max-w-2xl mx-auto flex flex-col gap-4">

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Title *</label>
                <input
                  ref={titleRef}
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Note title..."
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-indigo-500 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Content</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Write your note here..."
                  rows={12}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-indigo-500 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Tag</label>
                <div className="flex gap-2 flex-wrap">
                  {TAGS.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, tag: t }))}
                      className={`btn tag-chip ${form.tag === t ? tagStyle(t).bg + " ring-2 ring-indigo-400/50 ring-offset-1 ring-offset-zinc-950" : "bg-zinc-900 text-zinc-500 border-zinc-700"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom buttons (also visible in header, but handy on mobile) */}
              <div className="flex gap-2 pt-2 pb-10">
                <button
                  onClick={saveNote}
                  disabled={!form.title.trim()}
                  className="btn flex-1 bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm rounded-xl py-3 shadow shadow-indigo-500/30"
                >
                  {formMode === "add" ? "Add Note" : "Save Changes"}
                </button>
                <button onClick={goBack} className="btn px-5 bg-zinc-800 text-zinc-300 font-semibold text-sm rounded-xl py-3">
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}