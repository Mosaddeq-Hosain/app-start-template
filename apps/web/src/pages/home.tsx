import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import type { Note } from "@app/shared";

export function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/notes")
      .then((response) => {
        if (!response.ok) throw new Error("Could not load notes");
        return response.json() as Promise<Note[]>;
      })
      .then(setNotes)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Unexpected error"));
  }, []);

  async function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = String(data.get("body") ?? "").trim();
    if (!body) return;

    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (!response.ok) {
      setError("Could not save note");
      return;
    }
    const note = await response.json() as Note;
    setNotes((current) => [note, ...current]);
    setError("");
    form.reset();
  }

  return (
    <section>
      <p className="eyebrow">Local-first starter</p>
      <h1>Capture what matters.</h1>
      <p className="lede">A small full-stack foundation powered by React, Hono, and SQLite.</p>
      <form onSubmit={addNote}>
        <label htmlFor="body">New note</label>
        <div className="composer">
          <input id="body" name="body" placeholder="Write a thought..." autoComplete="off" />
          <button type="submit">Add note</button>
        </div>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="notes">
        {notes.map((note) => <article key={note.id}><p>{note.body}</p><time>{new Date(note.createdAt).toLocaleString()}</time></article>)}
        {!error && notes.length === 0 && <p className="empty">No notes yet. Add the first one.</p>}
      </div>
    </section>
  );
}
