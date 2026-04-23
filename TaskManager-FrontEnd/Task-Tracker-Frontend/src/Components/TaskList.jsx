import TaskItem from "./TaskItem";

function TaskList({ tasks, onDelete, onMarkDone }) {
  return (
    <div>
      {tasks.length === 0 ? (
        <h3 className="empty">No tasks found 🚀</h3>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
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