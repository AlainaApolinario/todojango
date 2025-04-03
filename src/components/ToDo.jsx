import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const API_URL = "https://todojango.onrender.com/api/tasks/";

export default function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  // Fetch tasks from API
  useEffect(() => {
    axios.get(API_URL)
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  // Apply dark mode
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Add new task
  const addTask = () => {
    if (newTask.trim() === "") return;
    axios.post(API_URL, { text: newTask, completed: false })
      .then(response => setTasks([...tasks, response.data]))
      .catch(error => console.error("Error adding task:", error));
    setNewTask("");
  };

  // Toggle completion
  const toggleCompletion = (id, completed) => {
    axios.patch(`${API_URL}${id}/`, { completed: !completed })
      .then(() => setTasks(tasks.map(task => task.id === id ? { ...task, completed: !completed } : task)))
      .catch(error => console.error("Error updating task:", error));
  };

  // Edit task
  const saveEdit = (id) => {
    axios.patch(`${API_URL}${id}/`, { text: editText })
      .then(() => {
        setTasks(tasks.map(task => task.id === id ? { ...task, text: editText } : task));
        setEditingTask(null);
      })
      .catch(error => console.error("Error editing task:", error));
  };

  // Delete task
  const deleteTask = (id) => {
    axios.delete(`${API_URL}${id}/`)
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(error => console.error("Error deleting task:", error));
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task =>
    filter === "completed" ? task.completed : filter === "pending" ? !task.completed : true
  );

  return (
    <div className="app-container">
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
                  <button onClick={() => setEditingTask(null)}>❌ Cancel</button>
                </>
              ) : (
                <>
                  <span>{task.text}</span>
                  <button onClick={() => { setEditingTask(task.id); setEditText(task.text); }}>✏️ Edit</button>
                  <button className="delete-btn" onClick={() => deleteTask(task.id)}>❌</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
