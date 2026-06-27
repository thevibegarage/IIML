const statusEl = document.getElementById('status');
const form = document.getElementById('add-form');
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const listEl = document.getElementById('task-list');
const emptyEl = document.getElementById('empty-state');
const statsEl = document.getElementById('stats');
const activeCountEl = document.getElementById('active-count');
const doneCountEl = document.getElementById('done-count');

let supabase = null;
let tasks = [];

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

function initSupabase() {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    setStatus('Missing Supabase config. Copy config.example.js to config.js.', true);
    addBtn.disabled = true;
    input.disabled = true;
    return false;
  }

  if (window.SUPABASE_URL.includes('YOUR_PROJECT') || window.SUPABASE_ANON_KEY.includes('YOUR_ANON')) {
    setStatus('Update config.js with your Supabase URL and anon key.', true);
    addBtn.disabled = true;
    input.disabled = true;
    return false;
  }

  supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  return true;
}

function renderTasks() {
  listEl.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item${task.completed ? ' done' : ''}`;
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));

    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'task-delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.append(checkbox, title, deleteBtn);
    listEl.appendChild(li);
  });

  const active = tasks.filter((t) => !t.completed).length;
  const done = tasks.filter((t) => t.completed).length;

  emptyEl.hidden = tasks.length > 0;
  statsEl.hidden = tasks.length === 0;
  activeCountEl.textContent = active;
  doneCountEl.textContent = done;
}

async function loadTasks() {
  setStatus('Loading tasks…');

  const { data, error } = await supabase
    .from('tasks')
    .select('id, title, completed, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    setStatus(`Failed to load tasks: ${error.message}`, true);
    return;
  }

  tasks = data;
  renderTasks();
  setStatus('');
}

async function addTask(title) {
  const trimmed = title.trim();
  if (!trimmed) return;

  addBtn.disabled = true;
  setStatus('Saving…');

  const { data, error } = await supabase
    .from('tasks')
    .insert({ title: trimmed, completed: false })
    .select('id, title, completed, created_at')
    .single();

  addBtn.disabled = false;

  if (error) {
    setStatus(`Failed to add task: ${error.message}`, true);
    return;
  }

  tasks.push(data);
  renderTasks();
  setStatus('');
  input.value = '';
  input.focus();
}

async function toggleTask(id, completed) {
  const { error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id);

  if (error) {
    setStatus(`Failed to update task: ${error.message}`, true);
    await loadTasks();
    return;
  }

  const task = tasks.find((t) => t.id === id);
  if (task) task.completed = completed;
  renderTasks();
}

async function deleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);

  if (error) {
    setStatus(`Failed to delete task: ${error.message}`, true);
    return;
  }

  tasks = tasks.filter((t) => t.id !== id);
  renderTasks();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(input.value);
});

if (initSupabase()) {
  loadTasks();
}
