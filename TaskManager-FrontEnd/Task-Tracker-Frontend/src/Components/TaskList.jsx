import TaskItem from "./TaskItem";

function TaskList({ tasks, onDelete, onMarkDone }) {
  // ✅ SAFETY: prevent undefined crash
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <div>
      {safeTasks.length === 0 ? (
        <h3 className="empty">No tasks found 🚀</h3>
      ) : (
        safeTasks.map((task, index) => (
          <TaskItem
            key={task?.id || index}
            task={task}
            onDelete={onDelete}
            onMarkDone={onMarkDone}
          />
        ))
      )}
    </div>
  );
}

export default TaskList;