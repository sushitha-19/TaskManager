function TaskItem({ task, onDelete, onMarkDone, onEdit }) {
  if (!task || typeof task !== "object") return null;

  const status = task.status || "pending";
  const priority = task.priority || "low";

  let formattedDate = "No deadline";

  if (task.dueDate) {
    const dateObj = new Date(task.dueDate);

    if (!isNaN(dateObj.getTime())) {
      formattedDate = dateObj.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
  }

  return (
    <div className={`task-card ${status}`}>

      <div className="task-header">
        <h3>{task.title || "Untitled Task"}</h3>

        <span className={`badge ${status}`}>
          {status.toUpperCase()}
        </span>
      </div>

      <p>
        <strong>Deadline:</strong> {formattedDate}
      </p>

      <p className={`priority ${priority}`}>
        {priority} Priority
      </p>

      <div className="btn-group">

        {status === "pending" ? (
          <button onClick={() => onMarkDone?.(task.id)}>
            Mark Done
          </button>
        ) : (
          <button disabled className="done-btn">
            Completed ✅
          </button>
        )}

        {/* ✅ NEW EDIT BUTTON */}
        <button onClick={() => onEdit?.(task)}>
          Edit
        </button>

        <button
          className="delete"
          onClick={() => onDelete?.(task.id)}
        >
          Delete
        </button>

      </div>
    </div>
  );
}

export default TaskItem;