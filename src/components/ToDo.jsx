import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

export default function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null); // Track the task being edited
  const [editText, setEditText] = useState(""); // Track the new text for the task
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Apply dark mode on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      setDarkMode(false);
      document.body.classList.remove("dark-mode");
    }
  }, []);

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
      .catch((error) => {
        console.error("Error adding task:", error);
        alert("Failed to add task. Please try again.");
      });
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

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditText("");
  };

  const saveEdit = (id) => {
    if (editText.trim() === "") {
      alert("Task text cannot be empty!");
      return;
    }
    axios
      .patch(`https://todojango.onrender.com/api/tasks/${id}/`, {
        text: editText.trim(),
      })
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, text: editText.trim() } : task
          )
        );
        setEditingTask(null);
        setEditText("");
      })
      .catch((error) => console.error("Error editing task:", error));
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
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <li key={task.id} className={task.completed ? "completed" : ""}>
                {editingTask === task.id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={() => saveEdit(task.id)}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleCompletion(task.id, task.completed)}
                    />
                    <span>{task.text}</span>
                    <button onClick={() => startEditing(task)}>✏️ Edit</button>
                    <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                      ❌
                    </button>
                  </>
                )}
              </li>
            ))
          ) : (
            <p>No tasks available. Add a new task to get started!</p>
          )}
        </ul>
      </div>
    </div>
  );
}