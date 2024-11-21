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
  }
});

// Function: Add Task
function addTask(task) {
  // Create task item
  const taskItem = document.createElement("li");
  taskItem.className = "task-item";

  taskItem.innerHTML = `
    <span>${task}</span>
    <button class="delete-btn">Delete</button>
  `;

  // Add delete functionality to the button
  taskItem.querySelector(".delete-btn").addEventListener("click", function () {
    taskItem.remove();
  });

  // Append the task to the task list
  taskList.appendChild(taskItem);
}

// Event: Delete All Tasks
// Add functionality to remove all tasks (Optional)
document.addEventListener("keydown", function (e) {
  if (e.key === "Delete") {
    taskList.innerHTML = ""; // Clear all tasks
  }
});
