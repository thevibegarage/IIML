# Task Planner

A simple one-page task planner. Frontend-only for now — tasks are saved in your browser via localStorage. Supabase backend coming later.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080

## Features

- Add, complete, and delete tasks
- Filter by All / Active / Done
- Clear completed tasks
- Persists in localStorage

## Supabase (later)

SQL schema is ready in `supabase/schema.sql`. When you're ready to connect the backend, we'll swap localStorage for Supabase in `app.js`.
