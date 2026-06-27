# Task Planner

A simple one-page task planner that saves tasks to Supabase.

## Setup

1. Create a [Supabase](https://supabase.com) project.
2. In the SQL Editor, run the script in `supabase/schema.sql`.
3. Copy your project URL and anon key from **Project Settings → API**.
4. Copy `config.example.js` to `config.js` and paste your credentials:

```js
window.SUPABASE_URL = 'https://your-project.supabase.co';
window.SUPABASE_ANON_KEY = 'your-anon-key';
```

5. Open `index.html` in a browser (or serve the folder with any static server).

## Features

- Add tasks
- Mark tasks complete
- Delete tasks
- Tasks persist in Supabase
