import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

export default function ToDo() {
  const API_URL = "https://todojango.onrender.com/api/tasks/";
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  // Fetch tasks from Django API
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Add new task
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post(API_URL, { text: newTask, completed: false });
      setNewTask("");
      fetchTasks(); // Refetch tasks instead of manually updating state
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Toggle task completion
  const toggleCompletion = async (id, completed) => {
    try {
      await axios.patch(`${API_URL}${id}/`, { completed: !completed });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Start editing a task
  const startEditing = (id, text) => {
    setEditingTask(id);
    setEditText(text);
  };

  // Save edited task
  const saveEdit = async (id) => {
    try {
      await axios.patch(`${API_URL}${id}/`, { text: editText });
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) =>
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
          {["all", "completed", "pending"].map((status) => (
            <button key={status} onClick={() => setFilter(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
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
                  <button onClick={() => startEditing(task.id, task.text)}>✏️ Edit</button>
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