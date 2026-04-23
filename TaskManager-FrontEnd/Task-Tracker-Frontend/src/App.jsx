import { useEffect, useState } from "react";
import "./App.css";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // 🔥 NEW

  // 🔥 Fetch tasks from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  // 🔥 Mark Done
  const handleMarkDone = (id) => {
    fetch(`http://localhost:8080/api/tasks/${id}/done`, {
      method: "PUT",
    })
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, status: "done" } : task
          )
        );
      })
      .catch((err) => console.error("Mark done error:", err));
  };

  // 🔥 Delete Task
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((err) => console.error("Delete error:", err));
  };

  // 🔥 FILTER LOGIC
  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return task.status === "pending";
    if (filter === "done") return task.status === "done";
    return true; // all
  });

  return (
    <div className="app-container">
      <h1 className="app-title">Task Tracker 🚀</h1>

      <TaskForm tasks={tasks} setTasks={setTasks} />

      {/* 🔥 FILTER BUTTONS */}
      <div style={{ textAlign: "center", margin: "15px" }}>
  <button
    className={filter === "all" ? "active-filter" : ""}
    onClick={() => setFilter("all")}
  >
    All
  </button>

  <button
    className={filter === "pending" ? "active-filter" : ""}
    onClick={() => setFilter("pending")}
    style={{ marginLeft: "10px" }}
  >
    Pending
  </button>

  <button
    className={filter === "done" ? "active-filter" : ""}
    onClick={() => setFilter("done")}
    style={{ marginLeft: "10px" }}
  >
    Done
  </button>
</div>

      <TaskList
        tasks={filteredTasks} // 🔥 PASS FILTERED TASKS
        onDelete={handleDelete}
        onMarkDone={handleMarkDone}
      />
    </div>
  );
}

export default App;