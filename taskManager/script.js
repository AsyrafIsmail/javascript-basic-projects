document.addEventListener("DOMContentLoaded", function () {

  // Select elements
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  // Add Task
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const task = taskInput.value.trim();
    const priority = document.getElementById("priority-select").value;

    if (task) {
      addTask(task, priority); 
      taskInput.value = "";
    } else {
      alert("Task cannot be empty!"); 
    }
  });

  // Add Task
  function addTask(task, priority) {

    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.dataset.priority = priority;
    taskItem.dataset.timestamp = Date.now();

    const timestamp = new Date().toLocaleString();

    taskItem.innerHTML = `
      <span class="task-text">${task}</span>
      <span class="task-priority">${priority.toUpperCase()}</span>
      <span class="task-timestamp">${timestamp}</span>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;

    taskItem.querySelector(".delete-btn").addEventListener("click", function () {
      taskItem.remove();
    });

    taskItem.querySelector(".edit-btn").addEventListener("click", function () {
      editTask(taskItem);
    });

    taskList.appendChild(taskItem);
    sortTasks();
  }

  // Edit Task
  function editTask(taskItem) {
    const taskText = taskItem.querySelector(".task-text");
    const taskPriority = taskItem.querySelector(".task-priority");
    const taskTimestamp = taskItem.querySelector(".task-timestamp");

    if (!taskText || !taskPriority || !taskTimestamp) return;

    const currentText = taskText.textContent;
    const currentPriority = taskPriority.textContent.toLowerCase();

    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = currentText;
    inputField.className = "edit-input";

    const prioritySelect = document.createElement("select");
    prioritySelect.innerHTML = `
    <option value="low" ${currentPriority === "low" ? "selected" : ""}>Low</option>
    <option value="medium" ${currentPriority === "medium" ? "selected" : ""}>Medium</option>
    <option value="high" ${currentPriority === "high" ? "selected" : ""}>High</option>
    `

    taskItem.replaceChild(inputField, taskText);
    taskItem.replaceChild(prioritySelect, taskPriority);


    const editBtn = taskItem.querySelector(".edit-btn");
    editBtn.textContent = "Save";

    editBtn.onclick = function() {
      saveTask(taskItem, inputField, prioritySelect);
    };

    sortTasks();
  }

  // Save Task
  function saveTask(taskItem, inputField, prioritySelect) {
    const updatedText = inputField.value.trim();
    const updatedPriority = prioritySelect.value;

    if (updatedText || updatedPriority) {
      const taskText = document.createElement("span");
      taskText.className = "task-text"; 
      taskText.textContent = updatedText;

      const taskPriority = document.createElement("span")
      taskPriority.className = "task-priority";
      taskPriority.textContent = updatedPriority.toUpperCase();

      taskItem.replaceChild(taskText, inputField);
      taskItem.replaceChild(taskPriority, prioritySelect);

      taskItem.dataset.priority = updatedPriority;

      const editBtn = taskItem.querySelector(".edit-btn");
      editBtn.textContent = "Edit";

      const newEditHandler = function () {
      editTask(taskItem);
    };
    editBtn.replaceWith(editBtn.cloneNode(true));
    taskItem.querySelector(".edit-btn").addEventListener("click", newEditHandler);

    sortTasks();
    } else {
      alert("Task cannot be empty!");
    }
  }

  function sortTasks() {
    const tasks = Array.from(taskList.children);

    tasks.sort((a, b) => {
      const priorityLevels = { high: 3, medium: 2, low: 1 };
      const priorityA = priorityLevels[a.dataset.priority];
      const priorityB = priorityLevels[b.dataset.priority];

      if (priorityA === priorityB) {
        return b.dataset.timestamp - a.dataset.timestamp;
      }

      return priorityB - priorityA;
    });

    taskList.innerHTML = "";
    tasks.forEach((task) => taskList.appendChild(task));
  }

  // Delete All Tasks
  document.addEventListener("keydown", function (e) {
    if (e.key === "Delete" && document.activeElement.tagName !== "INPUT") {
      if (confirm("Are you sure you want to delete all tasks?")) {
        taskList.innerHTML = ""; 
      }
    }
  });
});
