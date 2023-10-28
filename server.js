/*
   Maxwell Wilke
   Date: 8/7/23
   Description: This is a simple Express.js server for managing tasks using a JSON file.
*/

// Import required modules
const express = require("express");
const fs = require("fs");

// Create an Express application
const app = express();

// Middleware for parsing JSON requests and serving static files
app.use(express.json());
app.use(express.static("FrontEnd"));

// Define the path to the JSON file that stores tasks
const todosFile = "./todos.json";

// GET endpoint to retrieve tasks
app.get("/tasks", (req, res) => {
    // Read tasks from the JSON file and respond with the data
    res.json({ Items: JSON.parse(fs.readFileSync(todosFile)) });
});

// POST endpoint to add a new task
app.post("/tasks", (req, res) => {
    // Extract the task description from the request body
    /** @param {Object} req.body - The request body containing a task description. */
    let taskDescription = req.body.description;
    
    // Read the current list of tasks from the JSON file
    let todos = JSON.parse(fs.readFileSync(todosFile));
    
    // Calculate the ID for the new task
    let newId = 1;
    if (todos.length > 0) {
        let lastTask = todos[todos.length - 1];
        newId = lastTask.id + 1;
    }   

    // Check if a valid task description is provided
    if (taskDescription) {
        // Create a new task object and add it to the list
        todos.push({ id: newId, description: taskDescription });
        
        // Write the updated task list back to the JSON file
        fs.writeFileSync(todosFile, JSON.stringify(todos));
        
        // Respond with a success message
        res.send({ success: true, message: "Task added." });
    } else {
        // Respond with an error message if no task description is provided
        res.send({ message: "Task not added." });
    }
});

// DELETE endpoint to remove a task
app.delete("/tasks", (req, res) => {
    // Extract the task ID from the request body
    /** @param {Object} req.body - The request body containing a task ID to be deleted. */
    let taskId = req.body.id;
    
    // Read the current list of tasks from the JSON file
    let todos = JSON.parse(fs.readFileSync(todosFile));
    
    // Find the index of the task to be deleted
    let index = todos.findIndex(task => task.id === taskId);
    
    if (index !== -1) {
        // Remove the task from the list
        todos.splice(index, 1);
        
        // Write the updated task list back to the JSON file
        fs.writeFileSync(todosFile, JSON.stringify(todos));
        
        // Respond with a success message
        res.send({ success: true, message: "Task deleted." });
    } else {
        // Respond with an error message if the task is not found
        res.send({ message: "Task not found." });
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
