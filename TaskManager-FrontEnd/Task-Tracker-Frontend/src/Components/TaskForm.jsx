import { useState } from "react";

function TaskForm({ tasks, setTasks }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("12:00"); // ✅ time input
  const [priority, setPriority] = useState("low");

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ combine date + time
    const combinedDateTime = new Date(`${dueDate}T${dueTime}`);

    const newTask = {
      title,
      dueDate: combinedDateTime.toISOString(), // 🔥 send to Spring Boot
      priority,
      status: "pending",
    };

    fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks([...tasks, data]);
      })
      .catch((err) => {
        console.error("Error:", err);
        setTasks([...tasks, { ...newTask, id: Date.now() }]);
      });

    setTitle("");
    setDueDate("");
    setDueTime("12:00");
    setPriority("low");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* DATE */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />

      {/* TIME (NEW) */}
      <input
        type="time"
        value={dueTime}
        onChange={(e) => setDueTime(e.target.value)}
        required
      />

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;