import { useState } from "react";
import TaskForm from "../Components/TaskForm";
import TaskList from "../Components/TaskList";

function Home() {
  const [tasks, setTasks] = useState([]);

  return (
    <div style={{ width: "60%", margin: "auto" }}>
      <TaskForm tasks={tasks} setTasks={setTasks} />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

export default Home;