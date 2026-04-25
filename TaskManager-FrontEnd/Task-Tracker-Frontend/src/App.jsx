import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Signup from "./components/Signup";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import ForgotPassword from "./components/ForgotPassword";
import Verify from "./components/Verify"; // ✅ NEW

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("user") !== null
  );

  useEffect(() => {
    if (isLoggedIn) {
      const user = JSON.parse(localStorage.getItem("user"));

      fetch(`http://localhost:8080/api/tasks/${user.id}`)
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => {
          setTasks(data);
        })
        .catch((err) => {
          console.error(err);
          setTasks([]);
        });
    }
  }, [isLoggedIn]);

  const handleMarkDone = (id) => {
    fetch(`http://localhost:8080/api/tasks/${id}/done`, {
      method: "PUT",
    }).then(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "done" } : t))
      );
    });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return task.status === "pending";
    if (filter === "done") return task.status === "done";
    return true;
  });

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        {/* SIGNUP */}
        <Route path="/signup" element={<Signup />} />

        {/* FORGOT PASSWORD */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ✅ EMAIL VERIFICATION ROUTE */}
        <Route path="/verify" element={<Verify />} />

        {/* TASK PAGE */}
        <Route
          path="/tasks"
          element={
            isLoggedIn ? (
              <div className="app-container">
                <h1>Task Tracker 🚀</h1>

                <TaskForm setTasks={setTasks} />

                <div style={{ margin: "15px" }}>
                  <button onClick={() => setFilter("all")}>All</button>
                  <button onClick={() => setFilter("pending")}>Pending</button>
                  <button onClick={() => setFilter("done")}>Done</button>
                </div>

                <TaskList
                  tasks={filteredTasks}
                  onDelete={handleDelete}
                  onMarkDone={handleMarkDone}
                />

                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    setIsLoggedIn(false);
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;