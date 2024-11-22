document.addEventListener("DOMContentLoaded", function () {

  // Select elements
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  // Add Task
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const task = taskInput.value.trim();

    if (task) {
      addTask(task); 
      taskInput.value = "";
    } else {
      alert("Task cannot be empty!"); 
    }
  });

  // Add Task
  function addTask(task, isPriority = false) {

    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    if (isPriority) {
      taskItem.classList.add("priority");
    }

    taskItem.innerHTML = `
      <span class="task-text">${task}</span>
      <button class="priority-btn">${isPriority ? "Unmark Priority" : "Prioritize"}</button>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;

    taskItem.querySelector(".delete-btn").addEventListener("click", function () {
      taskItem.remove();
    });

    taskItem.querySelector(".edit-btn").addEventListener("click", function () {
      editTask(taskItem);
    });

    taskItem.querySelector(".priority-btn").addEventListener("click", function() {
      togglePriority(taskItem);
    })

    taskList.appendChild(taskItem);

    sortTasks();
  }

  // Edit Task
  function editTask(taskItem) {
    const taskText = taskItem.querySelector(".task-text");

    if (!taskText) {
      console.error("No task text element found! Cannot edit task.");
      return;
    }

    const currentText = taskText.textContent;

    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = currentText;
    inputField.className = "edit-input";

    taskItem.replaceChild(inputField, taskText);

    const editBtn = taskItem.querySelector(".edit-btn");
    editBtn.textContent = "Save";

    const newSaveHandler = function () {
      saveTask(taskItem, inputField);
    };
    editBtn.replaceWith(editBtn.cloneNode(true));
    taskItem.querySelector(".edit-btn").addEventListener("click", newSaveHandler);
  }

  // Save Task
  function saveTask(taskItem, inputField) {
    const updatedText = inputField.value.trim();

    if (updatedText) {
      const taskText = document.createElement("span");
      taskText.className = "task-text"; 
      taskText.textContent = updatedText;

      taskItem.replaceChild(taskText, inputField);

      const editBtn = taskItem.querySelector(".edit-btn");
      editBtn.textContent = "Edit";

      const newEditHandler = function () {
        editTask(taskItem);
      };
      editBtn.replaceWith(editBtn.cloneNode(true));
      taskItem.querySelector(".edit-btn").addEventListener("click", newEditHandler);
    } else {
      alert("Task cannot be empty!");
    }
  }

  // Toggle Priority
  function togglePriority(taskItem) {
    const isPriority = taskItem.classList.contains("priority");
    const priorityBtn = taskItem.querySelector(".priority-btn");

    if (isPriority) {
      taskItem.classList.remove("priority");
      priorityBtn.textContent = "Prioritze";
    } else {
      taskItem.classList.add("priority");
      priorityBtn.textContent = "Unmark Priority";
    }

    sortTasks();
  }

  function sortTasks() {
    const tasks = Array.from(taskList.children);

    tasks.sort((a, b) => {
      const aIsPriority = a.classList.contains("priority");
      const bIsPriority = b.classList.contains("priority");

      if (aIsPriority && !bIsPriority) return -1;
      if (!aIsPriority && bIsPriority) return 1;
      return 0;
    });

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
