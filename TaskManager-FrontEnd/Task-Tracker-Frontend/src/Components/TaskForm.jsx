import { useState, useEffect } from "react";

function TaskForm({ setTasks, editingTask, setEditingTask }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("12:00");
  const [priority, setPriority] = useState("low");

  // ✅ PREFILL WHEN EDITING
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);

      const dt = new Date(editingTask.dueDate);
      setDueDate(dt.toISOString().split("T")[0]);
      setDueTime(dt.toTimeString().slice(0, 5));

      setPriority(editingTask.priority);
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const combinedDateTime = `${dueDate}T${dueTime}:00`;

    const taskData = {
      title,
      dueDate: combinedDateTime,
      priority,
      status: editingTask ? editingTask.status : "pending",
    };

    try {
      let res;

      if (editingTask) {
        // ✅ UPDATE
        res = await fetch(
          `http://localhost:8080/api/tasks/${editingTask.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
          }
        );
      } else {
        // ✅ CREATE
        res = await fetch(
          `http://localhost:8080/api/tasks/${user.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
          }
        );
      }

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (editingTask) {
        setTasks((prev) =>
          prev.map((t) => (t.id === data.id ? data : t))
        );
        setEditingTask(null);
      } else {
        setTasks((prev) => [...prev, data]);
      }

    } catch (err) {
      console.error(err);
      alert("Operation failed");
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

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button type="submit">
        {editingTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;