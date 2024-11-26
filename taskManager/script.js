document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  // Add Task
  function addTask(taskName, priority, timeValue = null, timeUnit = null) {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    // Calculate deadline (optional)
    let deadlineText = "No deadline";
    let deadlineTimestamp = null;
    if (timeValue && timeUnit) {
      const currentTime = new Date();
      const deadline = new Date(currentTime);

      if (timeUnit === "minutes") {
        deadline.setMinutes(currentTime.getMinutes() + parseInt(timeValue));
      } else if (timeUnit === "hours") {
        deadline.setHours(currentTime.getHours() + parseInt(timeValue));
      } else if (timeUnit === "days") {
        deadline.setDate(currentTime.getDate() + parseInt(timeValue));
      }

      deadlineText = deadline.toLocaleString();
      deadlineTimestamp = deadline.getTime();
    }

    // Set dataset attributes for sorting
    taskItem.dataset.priority = priority;
    taskItem.dataset.timestamp = Date.now();
    if (deadlineTimestamp) taskItem.dataset.deadline = deadlineTimestamp;

    // Populate task item
    taskItem.innerHTML = `
      <div class="task-content">
        <div class="task-header">
          <span class="task-title">${taskName}</span>
          <span class="task-priority ${priority}-priority">${priority.toUpperCase()}</span>
        </div>
        <div class="task-footer">
          <span class="task-deadline"><i class="fas fa-clock"></i> ${deadlineText}</span>
          <div class="task-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    `;

    // Attach event listeners to Edit and Delete buttons
    const editBtn = taskItem.querySelector(".edit-btn");
    const deleteBtn = taskItem.querySelector(".delete-btn");

    editBtn.addEventListener("click", function () {
      editTask(taskItem);
    });

    deleteBtn.addEventListener("click", function () {
      taskItem.remove();
    });

    // Append task to the list
    taskList.appendChild(taskItem);
    sortTasks();
  }

  function editTask(taskItem) {
    const editBtn = taskItem.querySelector(".edit-btn");
  
    // Toggle between 'Edit' and 'Save'
    if (editBtn.textContent === "Edit") {
      const taskTitle = taskItem.querySelector(".task-title");
      const taskPriority = taskItem.querySelector(".task-priority");
      const taskDeadline = taskItem.querySelector(".task-deadline");
  
      // Get current values
      const currentTitle = taskTitle.textContent.trim();
      const currentPriority = taskPriority.textContent.trim().toLowerCase();
      const currentDeadline = taskDeadline.textContent.trim();
  
      // Convert deadline to a Date object
      const deadlineDate = new Date(currentDeadline);
      
      // Format the date to match the datetime-local input format (YYYY-MM-DDTHH:mm)
      const deadlineValue = deadlineDate.toISOString().slice(0, 16); // Extract only the date and time part
  
      // Create editable fields
      const titleInput = document.createElement("input");
      titleInput.type = "text";
      titleInput.value = currentTitle;
      titleInput.className = "edit-input";
  
      const prioritySelect = document.createElement("select");
      prioritySelect.innerHTML = `
        <option value="low" ${currentPriority === "low" ? "selected" : ""}>Low</option>
        <option value="medium" ${currentPriority === "medium" ? "selected" : ""}>Medium</option>
        <option value="high" ${currentPriority === "high" ? "selected" : ""}>High</option>
      `;
  
      const deadlineInput = document.createElement("input");
      deadlineInput.type = "datetime-local";
      deadlineInput.value = deadlineValue; // Set the deadline input value
  
      // Replace static elements with inputs
      taskTitle.replaceWith(titleInput);
      taskPriority.replaceWith(prioritySelect);
      taskDeadline.replaceWith(deadlineInput);
  
      // Switch button to 'Save'
      editBtn.textContent = "Save";
    } else {
      const titleInput = taskItem.querySelector(".edit-input");
      const prioritySelect = taskItem.querySelector("select");
      const deadlineInput = taskItem.querySelector("input[type='datetime-local']");
  
      // Get updated values
      const updatedTitle = titleInput.value.trim();
      const updatedPriority = prioritySelect.value;
      const updatedDeadline = new Date(deadlineInput.value);
  
      if (updatedTitle && updatedDeadline) {
        // Create static elements with updated values
        const newTitle = document.createElement("span");
        newTitle.className = "task-title";
        newTitle.textContent = updatedTitle;
  
        const newPriority = document.createElement("span");
        newPriority.className = `task-priority ${updatedPriority}-priority`;
        newPriority.textContent = updatedPriority.toUpperCase();
  
        const newDeadline = document.createElement("span");
        newDeadline.className = "task-deadline";
        newDeadline.innerHTML = `<i class="fas fa-clock"></i> ${updatedDeadline.toLocaleString()}`;
  
        // Replace inputs with static elements
        titleInput.replaceWith(newTitle);
        prioritySelect.replaceWith(newPriority);
        deadlineInput.replaceWith(newDeadline);
  
        // Switch button back to 'Edit'
        editBtn.textContent = "Edit";
      } else {
        alert("Please provide valid task details.");
      }
    }
  }
  
  
  // Sort Tasks by Priority and Deadline
  function sortTasks() {
    const tasks = Array.from(taskList.children);

    tasks.sort((a, b) => {
      const priorityLevels = { high: 3, medium: 2, low: 1 };
      const priorityA = priorityLevels[a.dataset.priority];
      const priorityB = priorityLevels[b.dataset.priority];

      if (priorityA === priorityB) {
        return (a.dataset.deadline || Infinity) - (b.dataset.deadline || Infinity);
      }

      return priorityB - priorityA;
    });

    taskList.innerHTML = "";
    tasks.forEach((task) => taskList.appendChild(task));
  }

  // Handle Form Submission
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const taskName = taskInput.value.trim();
    const priority = document.getElementById("priority-select").value;
    const timeValue = document.getElementById("time-value").value;
    const timeUnit = document.getElementById("time-unit").value;

    if (taskName) {
      addTask(taskName, priority, timeValue, timeUnit);
      taskForm.reset();
    } else {
      alert("Task cannot be empty!");
    }
  });
});
