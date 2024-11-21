// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Select elements
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  // Event: Add Task
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    const task = taskInput.value.trim();

    if (task) {
      addTask(task); // Add the task to the list
      taskInput.value = ""; // Clear input
    } else {
      alert("Task cannot be empty!"); // Notify user if empty
    }
  });

  // Function: Add Task
  function addTask(task) {
    // Create task item
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    taskItem.innerHTML = `
      <span class="task-text">${task}</span>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;

    // Add delete functionality to the button
    taskItem.querySelector(".delete-btn").addEventListener("click", function () {
      taskItem.remove();
    });

    // Add edit functionality to the button
    taskItem.querySelector(".edit-btn").addEventListener("click", function () {
      editTask(taskItem);
    });

    // Append the task to the task list
    taskList.appendChild(taskItem);
  }

  // Function: Edit Task
  function editTask(taskItem) {
    const taskText = taskItem.querySelector(".task-text");

    if (!taskText) {
      console.error("No task text element found! Cannot edit task.");
      return;
    }

    const currentText = taskText.textContent;

    // Replace the task text with an input field
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = currentText;
    inputField.className = "edit-input";

    taskItem.replaceChild(inputField, taskText);

    // Replace "Edit" button with "Save" button
    const editBtn = taskItem.querySelector(".edit-btn");
    editBtn.textContent = "Save";

    // Remove old click listeners and attach save functionality
    const newSaveHandler = function () {
      saveTask(taskItem, inputField);
    };
    editBtn.replaceWith(editBtn.cloneNode(true));
    taskItem.querySelector(".edit-btn").addEventListener("click", newSaveHandler);
  }

  // Function: Save Task
  function saveTask(taskItem, inputField) {
    const updatedText = inputField.value.trim();

    if (updatedText) {
      // Replace input field with updated text
      const taskText = document.createElement("span");
      taskText.className = "task-text"; // Ensure class is added back
      taskText.textContent = updatedText;

      taskItem.replaceChild(taskText, inputField);

      // Revert "Save" button back to "Edit"
      const editBtn = taskItem.querySelector(".edit-btn");
      editBtn.textContent = "Edit";

      // Remove old click listeners and attach edit functionality
      const newEditHandler = function () {
        editTask(taskItem);
      };
      editBtn.replaceWith(editBtn.cloneNode(true));
      taskItem.querySelector(".edit-btn").addEventListener("click", newEditHandler);
    } else {
      alert("Task cannot be empty!");
    }
  }

  // Event: Delete All Tasks
  document.addEventListener("keydown", function (e) {
    if (e.key === "Delete" && document.activeElement.tagName !== "INPUT") {
      if (confirm("Are you sure you want to delete all tasks?")) {
        taskList.innerHTML = ""; // Clear all tasks
      }
    }
  });
});
