// ===== DOM Elements =====
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filterBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ===== CRUD FUNCTIONS =====

// CREATE
function addTask() {
  if (taskInput.value.trim() === "") return;

  let task = {
    text: taskInput.value.trim(),
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskInput.value = "";
}

// READ & FILTER
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true; // "all"
  });

  filteredTasks.forEach((task, index) => {
    let li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <input type="checkbox" class="check" ${task.completed ? "checked" : ""} data-index="${index}">
      <span contenteditable="true" data-index="${index}">${task.text}</span>
      <button class="deleteBtn" data-index="${index}">❌</button>
    `;

    taskList.appendChild(li);
  });
}

// UPDATE
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index, newText) {
  tasks[index].text = newText.trim();
  saveTasks();
  renderTasks();
}

// DELETE
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// ===== LOCAL STORAGE =====
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== EVENT HANDLING =====

// Add task → click button
addBtn.addEventListener("click", addTask);

// Add task → press Enter
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

// Task actions (event delegation)
taskList.addEventListener("click", e => {
  if (e.target.classList.contains("deleteBtn")) {
    deleteTask(e.target.dataset.index);
  } else if (e.target.classList.contains("check")) {
    toggleTask(e.target.dataset.index);
  }
});

// Edit task → save on blur
taskList.addEventListener("blur", e => {
  if (e.target.tagName === "SPAN") {
    editTask(e.target.dataset.index, e.target.innerText);
  }
}, true);

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ===== INIT =====
renderTasks();
