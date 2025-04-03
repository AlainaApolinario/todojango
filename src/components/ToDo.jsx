import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

export default function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Apply dark mode on load
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  useEffect(() => {
    axios
      .get("https://todojango.onrender.com/api/tasks/")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

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

  const toggleCompletion = (id, completed) => {
    axios
      .patch(`https://todojango.onrender.com/api/tasks/${id}/`, {
        completed: !completed,
      })
      .then(() =>
        setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !completed } : task)))
      )
      .catch((error) => console.error("Error updating task:", error));
  };

  const deleteTask = (id) => {
    axios
      .delete(`https://todojango.onrender.com/api/tasks/${id}/`)
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((error) => console.error("Error deleting task:", error));
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "completed" ? task.completed : filter === "pending" ? !task.completed : true
  );

  return (
    <div className="app-container">
      <h1>React TODO App</h1>
      <button className="theme-toggle" onClick={toggleDarkMode}>
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
              <span>{task.text}</span>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
