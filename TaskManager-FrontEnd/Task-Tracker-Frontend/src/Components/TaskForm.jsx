import { useState } from "react";

function TaskForm({ setTasks }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("12:00");
  const [priority, setPriority] = useState("low");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    const combinedDateTime = new Date(`${dueDate}T${dueTime}`);

    const newTask = {
      title,
      dueDate: combinedDateTime.toISOString().slice(0, 19),
      priority,
      status: "pending",
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/tasks/${user.id}`, // ✅ correct API
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      // ✅ Add real DB task
      setTasks((prev) => [...prev, data]);

    } catch (err) {
      console.error("Error:", err);
      alert("Task creation failed");
    }

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

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />

      <input
        type="time"
        value={dueTime}
        onChange={(e) => setDueTime(e.target.value)}
        required
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;