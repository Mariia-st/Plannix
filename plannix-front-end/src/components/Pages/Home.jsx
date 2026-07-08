import { useEffect, useState } from "react";
import api from "../../api/axios";
import TaskList from "../Task/TaskList";
import TaskForm from "../Task/TaskForm";
import TaskDetail from "../Task/TaskDetail";
import { hover, motion, time } from "motion/react";

export default function Home() {
  //lista de tareas
  const [tasks, setTasks] = useState(null);
  // para sacar info de una tarea en concreto
  const [task, setTask] = useState(null);
  //error de validación
  const [error, setError] = useState(null);
  //control de boton
  const [loading, setLoading] = useState(false);
  //codigo
  const [code, setCode] = useState("");
  //control de mensaje
  const [isCreated, setIsCreated] = useState(false);

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
    baja: "bg-success text-white",
    media: "bg-warning text-white",
    alta: "bg-danger text-white",
    urgente: "text-white bg-dark",
  };

  // llama desde inicio al get de tareas
  useEffect(() => {
    fetchData();
  }, []);

  //saca todas las tareas
  async function fetchData() {
    setLoading(true);
    try {
      const response = await api.get("tasks");
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  //creación de nueva tarea
  const heandleSubmit = async (e) => {
    e.preventDefault(); //sin recarga
    setError(null);

    if (formData.title === "") {
      return setError("El titulo es obligatorio");
    }

    setLoading(true);

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

      setIsCreated(true);

      setTimeout(() => {
        setIsCreated(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // elimina la tarea concreta
  async function deleteTask(id) {
    setLoading(true);

    try {
      const response = await api.delete(`tasks/${id}`);
      fetchData();
      setTask(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  //actualiza la tarea concreta
  async function updateTask(updatedTask) {
    setLoading(true);

    try {
      const response = await api.put(`tasks/${updatedTask.id}`, updatedTask);
      console.log(response);
      fetchData();
      setTask(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // hace petición al obtener la información de una tarea en concreto
  async function getTaskById(id) {
    setLoading(true);

    try {
      const response = await api.get(`tasks/${id}`);
      setTask(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function getCode() {
    setLoading(true);

    try {
      const response = await api.get(`user/code`);
      setCode(response.data.code);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="  container">
      <div className="row">
       
          {/* si task no elegido */}
          {task !== null && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <TaskDetail
                task={task}
                onClose={() => setTask(null)}
                onDelete={deleteTask}
                priorityColors={priorityColors}
                updateTask={updateTask}
                loading={loading}
              />
            </motion.div>
          )}
          {isCreated ? (
            <div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="alert  alert-success small  "
              role="alert"
              >
              Tarea creada con exito !
            </motion.div>
              </div>
          ) : (
            <div></div>
          )}

            <div className=" row m-0  ">
              <div className=" col-12 pb-2  col-lg-7 ">
                <TaskList
                  tasks={tasks}
                  onSelectTask={getTaskById}
                  priorityColors={priorityColors}
                  loading={loading}
                />
              </div>
              <div className="col-12 col-lg-5">
                <TaskForm
                  error={error}
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={heandleSubmit}
                  loading={loading}
                />
              </div>
            </div>
       
          <div className="pt-5">
            <section className="bg-white p-5 rounded-4 border shadow-sm d-flex flex-wrap align-items-center justify-content-between">
              <div style={{ maxWidth: "400px" }}>
                <h3 className="h4 fw-bold text-dark mb-3">
                  <i className="bi bi-robot me-2"></i> Integración con Telegram
                </h3>
                <ul className="text-secondary list-unstyled">
                  <li className="mb-2">
                    <span className="badge bg-primary me-2">1</span> Haz clic en
                    "Recibir el código".
                  </li>
                  <li className="mb-2">
                    <span className="badge bg-primary me-2">2</span> Ve a
                    nuestro bot en Telegram.
                  </li>
                  <li className="mb-2">
                    <span className="badge bg-primary me-2">3</span> Pulsa
                    "Start" e introduce el código.
                  </li>
                </ul>
              </div>

              <div
                className="bg-light p-3 rounded-3 text-center border shadow-inner"
                style={{ minWidth: "250px" }}
              >
                <p className="small text-muted mb-2">
                  Tu código de vinculación:
                </p>

                <motion.h3
                  key={code}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-primary fw-bold my-2"
                >
                  {code || "----"}
                </motion.h3>

                <div className="d-flex flex-column gap-2 mt-3">
                  <button
                    className="btn btn-dark btn-sm shadow-sm"
                    onClick={getCode}
                  >
                    Generar nuevo código
                  </button>

                  <a
                    href="https://t.me/PlannixBot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Ir a Plannix Bot
                  </a>
                </div>
              </div>
            </section>
          </div>
     
      </div>
    </div>
  );
}
