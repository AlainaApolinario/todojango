import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

export default function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Fetch tasks from deployed Django API
  useEffect(() => {
    axios
      .get("https://todojango.onrender.com/api/tasks/")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  useEffect(() => {
    // Update localStorage and body class on darkMode change
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  // Add new task (POST)
  const addTask = () => {
    if (newTask.trim() === "") return;
    axios
      .post("https://todojango.onrender.com/api/tasks/", {
        text: newTask,
        completed: false,
      })
      .then((response) => setTasks([...tasks, response.data]))
      .catch((error) => console.error("Error adding task:", error));
    setNewTask("");
  };

  // Toggle completion status (PATCH)
  const toggleCompletion = (id, completed) => {
    axios
      .patch(`https://todojango.onrender.com/api/tasks/${id}/`, { completed: !completed })
      .then(() =>
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: !completed } : task
          )
        )
      )
      .catch((error) => console.error("Error updating task:", error));
  };

  // Enable edit mode
  const startEditing = (id, text) => {
    setEditingTask(id);
    setEditText(text);
  };

  // Save edited task (PATCH)
  const saveEdit = (id) => {
    axios
      .patch(`https://todojango.onrender.com/api/tasks/${id}/`, { text: editText })
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, text: editText } : task
          )
        );
        setEditingTask(null);
      })
      .catch((error) => console.error("Error editing task:", error));
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingTask(null);
    setEditText("");
  };

  // Delete task (DELETE)
  const deleteTask = (id) => {
    axios
      .delete(`https://todojango.onrender.com/api/tasks/${id}/`)
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((error) => console.error("Error deleting task:", error));
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) =>
    filter === "completed"
      ? task.completed
      : filter === "pending"
      ? !task.completed
      : true
  );

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <h1>React TODO App</h1>
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="todo-container">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>

        <div className="filters">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
        </div>

        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id} className={task.completed ? "completed" : ""}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompletion(task.id, task.completed)}
              />
              {editingTask === task.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(task.id)}>✅ Save</button>
                  <button onClick={cancelEdit}>❌ Cancel</button>
                </>
              ) : (
                <>
                  <span>{task.text}</span>
                  <button onClick={() => startEditing(task.id, task.text)}>
                    ✏️ Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                    ❌
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
