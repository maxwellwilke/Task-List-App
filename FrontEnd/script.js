/*
   Maxwell Wilke
   Date: 8/7/23
   Description: This JavaScript code handles interactions with a task management front end.
*/

// Define the URL for the server API
const url = "http://localhost:3000/tasks";

/**
 * Function to initialize the page.
 * Adds a click event listener to the "New Task" button and fetches and displays all tasks.
 */
const init = () => {
    // Add a click event listener to the "New Task" button
    document.querySelector("#newTask").addEventListener("click", addNewTask);

    // Add a key press event listener to the task input field
    document.querySelector("#task").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addNewTask(event); // Pass the event to the function
        }
    });
    
    // Fetch and display all tasks
    getAllTasksAndDisplay();
}

/**
 * Function to send a request to add a new task to the server.
 * @param {string} taskDescription - The description of the new task.
 */
const addNewTask = (event) => {
    // Prevent default form submission behavior
    event.preventDefault();

    // Get the task description from the input field
    let taskDescription = document.querySelector("#task").value;

    // Check if the task description is empty
    if (!taskDescription.trim()) {
        alert("Task description cannot be empty.");
        return;
    }

    // Send a POST request to add the new task
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ description: taskDescription })
    })
    .then(response => {
        if (!response.ok) {
            console.error("Response not OK");
            return;
        }
        // If the task is added successfully, refresh the task list and clear the input field
        getAllTasksAndDisplay();
        document.querySelector("#task").value = "";
        // Automatically select the text input
        document.querySelector("#task").focus();
    })
    .catch(error => {
        console.error("Error adding a new task:", error);
    });
}

/**
 * Function to fetch tasks from the server and display them.
 */
const getAllTasksAndDisplay = () => {
    // Fetch the list of tasks from the server
    fetch(url)
    .then(response => {
        if (!response.ok) {
            console.error("Response not OK");
            return;
        }
        // Parse the response data as JSON
        return response.json();
    })
    .then(data => {
        if (data) {
            // Display the list of tasks on the web page
            outputTaskList(data.Items);
        }
    })
    .catch(error => {
        console.error("Error fetching tasks:", error);
    });
}

/**
 * Function to send a request to delete a specific task from the server.
 * @param {number} taskId - The ID of the task to be deleted.
 */
const deleteTask = (taskId) => {
    // Send a DELETE request to the server to delete the specified task
    fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: taskId })
    })
    .then(response => {
        if (!response.ok) {
            console.error("Response not OK");
            return;
        }
        // If the task is deleted successfully, refresh the task list
        getAllTasksAndDisplay();
    })
    .catch(error => {
        console.error("Error deleting task:", error);
    });
}

/**
 * Function to output tasks to the webpage using DHTML.
 * @param {Array} taskList - An array of task objects to be displayed.
 */
const outputTaskList = (taskList) => {
    let outputArea = document.getElementById("outputArea");
    outputArea.innerHTML = "";

    let taskListHeading = document.createElement("h2");
    taskListHeading.textContent = "Task List";
    outputArea.appendChild(taskListHeading);

    let ul = document.createElement("ul");
    taskList.forEach(task => {
        let li = document.createElement("li");

        // Create a "Delete" button for each task
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Done";
        deleteButton.addEventListener("click", () => deleteTask(task.id));

        // Create a span for the task description
        let taskDescription = document.createElement("span");
        taskDescription.textContent = `${task.id}. ${task.description}`;

        // Append the delete button and task description to the list item
        li.appendChild(deleteButton);
        li.appendChild(taskDescription);

        // CSS for delete button
        deleteButton.style.marginRight = "10px"; 

        // Append the list item to the unordered list
        ul.appendChild(li);
    });

    // Append the unordered list to the output area
    outputArea.appendChild(ul);
}

// Initialize the page when the window loads
window.onload = init;
