import { useEffect, useState } from "react";
import api from "../../api/axios";
import TaskList from "../Task/TaskList";
import TaskForm from "../Task/TaskForm";
import TaskDetail from "../Task/TaskDetail";

export default function Home() {

  //lista de tareas
  const [tasks, setTasks] = useState(null);
  // para sacar info de una tarea en concreto
  const [task, setTask] = useState(null);
  //error de validación
  const [error, setError] = useState(null);
  //control de boton
  const [loading,setLoading]= useState(false) 
  //codigo 
  const[code,setCode]=useState("")

// formulario de insertar nueva tarea
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pendiente",
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


  async function getCode(){
    setLoading(true)

    try {
      const response = await api.get(`user/code`);
      setCode(response.data.code);
   
      
    } catch (error) {
      console.log(error);

    }finally{
      setLoading(false)
    }
  }

  

  return (
    <div className=" container ">
      <div className="row">
        <div>
          {/* si task no elegido */}
        {task !== null && (
          <div>
            <TaskDetail
              task={task}
              onClose={()=>setTask(null)}
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
          <div className="pt-5">
            <section className="bg-white rounded border d-flex p-4 gap-5  justify-content-evenly ">

              <div>
                <h3>Uso de telegram bot</h3>
                <ul className=" text-secondary">
                  <li>Pinchar al boton de recibir el <span className=" badge bg-primary">code</span> </li>
                  <li>Pasar al enlace del bot en telegram</li>
                  <li>Pinchar start</li>
                  <li>Escribir este codigo </li>
                </ul>
              </div>

              <div>
                <button className="btn btn-sm btn-dark" onClick={getCode}> recibir el codigo</button>
                <h3>Code:{code}</h3>
              </div>

            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
