import { useEffect, useState } from "react";
import api from "../api/axios";
import TaskList from "./Task/TaskList";
import TaskForm from "./Task/TaskForm";
import TaskDetail from "./Task/TaskDetail";

export default function Home() {

  //lista de tareas
  const [tasks, setTasks] = useState(null);
  // para sacar info de una tarea en concreto
  const [task, setTask] = useState(null);
  //error de validación
  const [error, setError] = useState(null);
  //control de boton
  const [loading,setLoading]= useState(false) 



// formulario de insertar nueva tarea
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pediente",
    priority: "baja",
    deadline: "",
  });

  // estado visual de prioridad de tarea
  const priorityColors = {
    baja: "bg-success",
    media: "bg-warning",
    alta: "bg-danger",
    urgente: "text-white bg-dark",
  };


  // llama desde inicio al get de tareas 
  useEffect(() => {
    fetchData();
  }, []);

  //saca todas las tareas
  async function fetchData() {
    setLoading(true)
    try {
      const response = await api.get("tasks");
      setTasks(response.data);
      
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }

  }


  //creación de nueva tarea
  const heandleSubmit = async (e) => {
    e.preventDefault(); //sin recarga
    setError(null);
    if (formData.title === "") {
      return setError("El titulo es obligatorio");
    }
    setLoading(true)
    try {
      const response = await api.post("/tasks", formData);
     
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
    }finally{
      setLoading(false)
    }
  };

// elimina la tarea concreta
  async function deleteTask(id) {

    setLoading(true)
    try {
      const response = await api.delete(`tasks/${id}`);
      fetchData();
      setTask(null);
    
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  }


  //actualiza la tarea concreta
  async function updateTask(updatedTask){
   
    setLoading(true)
    try{
      const response = await api.put(`tasks/${updatedTask.id}`,updatedTask)
      console.log(response)
      fetchData()
      setTask(null);
  

    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  }



  // hace petición al obtener la información de una tarea en concreto
  async function getTaskById(id) {
   

    setLoading(true)
    try {
      const response = await api.get(`tasks/${id}`);
      setTask(response.data);
      
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  }

  const handleCloseTask = () => {
  
    setTask(null);
  };

  return (
    <div className=" container ">
      <div className="row">
        <div>
        {task !== null && (
          <div>
            <TaskDetail
              task={task}
              onClose={handleCloseTask}
              onDelete={deleteTask}
              priorityColors={priorityColors}
              updateTask={updateTask}
              loading={loading}
            />
          </div>
          )}
          <div className="d-flex  gap-5">
            <TaskList
              tasks={tasks}
              onSelectTask={getTaskById}
              priorityColors={priorityColors}
              loading={loading}
            />

            <TaskForm
              error={error}
              formData={formData}
              setFormData={setFormData}
              onSubmit={heandleSubmit}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
