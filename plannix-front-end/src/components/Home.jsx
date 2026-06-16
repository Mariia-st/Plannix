import { useEffect, useState } from "react";
import api from "../api/axios";
import TaskList from "./Task/TaskList";
import TaskForm from "./Task/TaskForm";
import TaskDetail from "./Task/TaskDetail";

export default function Home() {
  const [tasks, setTasks] = useState(null);
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [infoTask, setInfoTask] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    try {
      const response = await api.get("tasks");
      setTasks(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTask(id) {
    try {
      const response = await api.delete(`tasks/${id}`);
      console.log(response);
      fetchData();
      setTask(null);
      setInfoTask(false);
    } catch (error) {
      console.log(error);
    }
  }

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pediente",
    priority: "baja",
    deadline: "",
  });

  const priorityColors = {
    baja: "bg-success",
    media: "bg-warning",
    alta: "bg-danger",
    urgente: "text-white bg-dark",
  };

  async function handleTouch(id) {
    setInfoTask(true);
    try {
      const response = await api.get(`tasks/${id}`);
      setTask(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const heandleSubmit = async (e) => {
    e.preventDefault(); //sin recarga
    setError(null);
    if (formData.title === "") {
      return setError("El titulo es obligatorio");
    }
    try {
      const response = await api.post("/tasks", formData);
      console.log(response);
      fetchData();
      setFormData({
        title: "",
        description: "",
        status: "pediente",
        priority: "baja",
        deadline: "",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloseTask = () => {
    setInfoTask(false);
    setTask(null);
  };

  return (
    <div className=" container ">
      <div className="row">
        <div>
          <div>
            <TaskDetail
              task={task}
              onClose={handleCloseTask}
              onDelete={deleteTask}
              priorityColors={priorityColors}
            />
          </div>
          <div className="d-flex  gap-5">
            <TaskList
              tasks={tasks}
              onSelectTask={handleTouch}
              priorityColors={priorityColors}
            />

            <TaskForm
              error={error}
              formData={formData}
              setFormData={setFormData}
              onSubmit={heandleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
