// Selectors
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskProgress = document.getElementById("taskProgress");
const completedCount = document.getElementById("completedCount");
const totalCount = document.getElementById("totalCount");
const overlay = document.getElementById("overlay");

// Load tasks from local storage on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Event Listeners
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});
taskList.addEventListener("click", modifyTask);

// Functions
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === "") {
        showNotification("Task cannot be empty!");
        return;
    }
    
    const taskItem = createTaskElement(taskText);
    taskList.appendChild(taskItem);

    saveTasks();
    updateProgress();
    taskInput.value = ""; // Clear input
}

function createTaskElement(taskText) {
    const li = document.createElement("li");

    // Finish Checkbox (moved to the left)
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");

    const textSpan = document.createElement("span");
    textSpan.innerText = taskText;

    const iconContainer = document.createElement("div");
    iconContainer.classList.add("icons");

    const editIcon = document.createElement("img");
    editIcon.src = "images/edit.jpeg"; // Ensure you have this image
    editIcon.classList.add("icon");
    editIcon.setAttribute("title", "Edit task");

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "images/delete.jpg"; // Ensure you have this image
    deleteIcon.classList.add("icon");
    deleteIcon.setAttribute("title", "Delete task");

    iconContainer.appendChild(editIcon);
    iconContainer.appendChild(deleteIcon);

    // Append elements to list item
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(iconContainer);

    checkbox.addEventListener("change", updateProgress);

    return li;
}

function modifyTask(e) {
    const target = e.target;
    const li = target.closest("li");

    if (target.tagName === "INPUT" && target.type === "checkbox") {
        li.classList.toggle("completed");
        updateProgress();
    } else if (target.src && target.src.includes("edit.jpeg")) {
        editTask(li);
    } else if (target.src && target.src.includes("delete.jpg")) {
        showNotification("Task deleted successfully!");
        li.remove();
        saveTasks();
        updateProgress();
    }
}

function editTask(li) {
    const taskTextElement = li.querySelector("span");
    const taskText = taskTextElement.innerText;

    // Create an input field
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = taskText; // Pre-fill with the current task text
    inputField.classList.add("edit-input"); // Optional class for styling

    // Replace the span with the input field
    li.replaceChild(inputField, taskTextElement); // Replace the span directly

    // Focus on the input field
    inputField.focus();

    // Handle the input field blur event
    inputField.addEventListener("blur", () => {
        updateTaskText(inputField, li);
    });

    // Handle the Enter key event
    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            updateTaskText(inputField, li);
        }
    });
}

// Function to update task text and save changes
function updateTaskText(inputField, li) {
    const newTaskText = inputField.value.trim();
    
    if (newTaskText !== "") {
        const newTextSpan = document.createElement("span");
        newTextSpan.innerText = newTaskText;
        
        li.replaceChild(newTextSpan, inputField); // Replace the input field with the new span
        saveTasks(); // Save updated tasks to local storage
    } else {
        // If empty, you can choose to remove the task or handle it differently
        li.remove();
        showNotification("Task deleted successfully!");
    }
}


function saveTasks() {
    const tasks = [];
    taskList.childNodes.forEach((li) => {
        tasks.push({
            text: li.querySelector("span").innerText,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const li = createTaskElement(task.text);
        if (task.completed) {
            li.classList.add("completed");
            li.querySelector(".task-checkbox").checked = true;
        }
        taskList.appendChild(li);
    });
    updateProgress();
}

function updateProgress() {
    const tasks = taskList.querySelectorAll("li");
    const completedTasks = taskList.querySelectorAll("li.completed");

    const totalTasks = tasks.length;
    const completedCountValue = completedTasks.length;

    totalCount.innerText = totalTasks;
    completedCount.innerText = completedCountValue;

    taskProgress.value = totalTasks > 0 ? (completedCountValue / totalTasks) * 100 : 0;

    // Trigger confetti if all tasks are completed
    if (completedCountValue === totalTasks && totalTasks > 0) {
        launchConfetti();
    }

    saveTasks();
}

// Confetti launch function
function launchConfetti() {
    const count = 200,
        defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    setTimeout(() => {
        showNotification("Congratulations! All tasks completed.");
    }, 1000);
}


// Function to show notification
function showNotification(message) {
    // Show the overlay
    overlay.style.display = "block"; // Show overlay

    // Create the notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `<span>${message}</span><button class="ok-button">OK</button>`;
    
    // Append notification to the container
    document.getElementById("notificationContainer").appendChild(notification);

    // Add event listener for the OK button
    notification.querySelector(".ok-button").addEventListener("click", function() {
        notification.remove(); // Remove notification
        overlay.style.display = "none"; // Hide overlay when OK is clicked
    });
}
