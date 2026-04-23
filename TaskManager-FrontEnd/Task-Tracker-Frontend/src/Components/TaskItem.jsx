function TaskItem({ task, onDelete, onMarkDone }) {
  return (
    <div className={`task-card ${task.status}`}>

      <div className="task-header">
        <h3>{task.title}</h3>

        <span className={`badge ${task.status}`}>
          {task.status.toUpperCase()}
        </span>
      </div>

      {/* ✅ CLEAN DATE + TIME FORMAT */}
      <p>
        <strong>Deadline:</strong>{" "}
        {new Date(task.dueDate).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>

      <p className={`priority ${task.priority}`}>
        {task.priority} Priority
      </p>

      <div className="btn-group">
        {task.status === "pending" ? (
          <button onClick={() => onMarkDone(task.id)}>
            Mark Done
          </button>
        ) : (
          <button disabled className="done-btn">
            Completed ✅
          </button>
        )}

        <button className="delete" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>

    </div>
  );
}

export default TaskItem;