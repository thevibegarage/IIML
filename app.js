const STORAGE_KEY = 'task-planner-tasks';

const statusEl = document.getElementById('status');
const form = document.getElementById('add-form');
const input = document.getElementById('task-input');
const listEl = document.getElementById('task-list');
const emptyEl = document.getElementById('empty-state');
const statsEl = document.getElementById('stats');
const activeCountEl = document.getElementById('active-count');
const doneCountEl = document.getElementById('done-count');
const filterBtns = document.querySelectorAll('[data-filter]');
const clearBtn = document.getElementById('clear-done');

let tasks = [];
let filter = 'all';

function createId() {
  return crypto.randomUUID();
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    tasks = saved ? JSON.parse(saved) : [];
  } catch {
    tasks = [];
  }
}

function visibleTasks() {
  if (filter === 'active') return tasks.filter((t) => !t.completed);
  if (filter === 'done') return tasks.filter((t) => t.completed);
  return tasks;
}

function renderTasks() {
  const shown = visibleTasks();
  listEl.innerHTML = '';

  shown.forEach((task) => {
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

  emptyEl.hidden = shown.length > 0;
  emptyEl.textContent =
    tasks.length === 0
      ? 'No tasks yet. Add one above.'
      : filter === 'active'
        ? 'No active tasks. Nice work.'
        : filter === 'done'
          ? 'No completed tasks yet.'
          : 'No tasks yet. Add one above.';

  statsEl.hidden = tasks.length === 0;
  activeCountEl.textContent = active;
  doneCountEl.textContent = done;
  clearBtn.hidden = done === 0;

  filterBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

function addTask(title) {
  const trimmed = title.trim();
  if (!trimmed) return;

  tasks.push({
    id: createId(),
    title: trimmed,
    completed: false,
    created_at: new Date().toISOString(),
  });

  saveTasks();
  renderTasks();
  input.value = '';
  input.focus();
}

function toggleTask(id, completed) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.completed = completed;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(input.value);
});

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    renderTasks();
  });
});

clearBtn.addEventListener('click', clearCompleted);

loadTasks();
renderTasks();
