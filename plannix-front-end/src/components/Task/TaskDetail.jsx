import { useState } from "react";
import { useEffect } from "react";
import {  motion } from "motion/react";
// components/TaskDetail.js
export default function TaskDetail({
  task,
  onClose,
  onDelete,
  priorityColors,
  loading,
  updateTask,
}) {
  //variables de error de titulo/  update estado de formulario/ taskUpdates datos de task actualizado
  const [inputError, setInputError] = useState("");
  const [updated, setUpdated] = useState(false);
  const [taskUpdated, setTaskUpdated] = useState(task);

  // sacamos datos de task  para mostrar y cambiarlos
  useEffect(() => {
    setTaskUpdated(task);
  }, [task]);

  // guardamos los datos cambiados
  const handleChange = (e) => {
    const { name, value } = e.target;

    setTaskUpdated((prev) => ({ ...prev, [name]: value }));

    // si titulo no esta sereamos el error
    if (name === "title") {
      if (value.trim() === "") {
        setInputError("El título es obligatorio");
      } else {
        setInputError("");
      }
    }
  };

  // cerramos la edición y volvemos datos viejos de tarea
  function cancel() {
    setUpdated(false);
    setTaskUpdated(task);
  }

  return (
    
      <motion.div className=" d-flex justify-content-center px-2 " initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{width:"650px"}}>
        <div
          className="card shadow-lg border-0 rounded-4 overflow-hidden w-100"
          style={{ maxWidth: "700px" }}
        >
          <div className="d-flex flex-column flex-md-row">
            {/* Barra lateral de estado/prioridad */}
            {!updated ? (
              <div
                className={`${priorityColors[taskUpdated.priority]} m-2 p-3 text-white d-flex flex-md-column justify-content-center rounded align-items-center gap-2`}
              >
                <span
                  className="fw-bold text-uppercase small"
                
                >
                  {taskUpdated.priority}
                </span>
              </div>
            ) : (
              <select
                name="priority"
                className={`${priorityColors[taskUpdated.priority]} fw-bold text-uppercase small   form-select form-select-sm p-3 m-2 text-center`}
                style={{ width: "auto" }}
                onChange={handleChange}
                value={taskUpdated.priority}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            )}

            {/* Cuerpo principal */}
            <div className="card-body p-4 w-100">
              <div className="d-flex justify-content-between align-items-start mb-3">
                {!updated ? (
                  <h3 className="fw-bold m-0 text-dark">{taskUpdated.title}</h3>
                ) : (
                  <div className="w-100 me-3">
                    <input
                      name="title"
                      className="form-control form-control-lg"
                      onChange={handleChange}
                      value={taskUpdated.title}
                    />
                  </div>
                )}
                <button className="btn-close ms-2" onClick={onClose}></button>
              </div>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {!updated ? (
                  <>
                    <span className="badge bg-light text-secondary border px-3 py-2">
                      {taskUpdated.status}
                    </span>
                    <span className="badge bg-light text-secondary border px-3 py-2">
                      {taskUpdated.deadline
                        ? new Date(taskUpdated.deadline).toISOString().slice(0,16).replace("T",", ")
                        : "Sin fecha"}
                    </span>
                  </>
                ) : (
                  <div className="d-flex gap-2 w-100">
                    <select
                      name="status"
                      className="form-select form-select-sm"
                      onChange={handleChange}
                      value={taskUpdated.status}
                    >
                      <option value="pediente">Pendiente</option>
                      <option value="en curso">En curso</option>
                      <option value="completada">Completada</option>
                    </select>
                    <input
                      name="deadline"
                      lang="es-ES"
                      type="datetime-local"
                      className="form-control form-control-sm"
                      onChange={handleChange}
                      value={
                        taskUpdated.deadline
                          ?  new Date(taskUpdated.deadline).toISOString().slice(0,16)
                          : ""
                      }
                    />
                  </div>
                )}
              </div>

              {!updated ? (
                <p className="text-secondary p-3 bg-light rounded-3 shadow-inner">
                  {taskUpdated.description || "Sin descripción disponible."}
                </p>
              ) : (
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  onChange={handleChange}
                  value={taskUpdated.description}
                  placeholder="Añade detalles..."
                />
              )}

              {/* Panel de acciones integrado */}
              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                {!updated ? (
                  <>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="btn btn-danger btn-sm px-3 rounded-pill"
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-primary btn-sm px-3 rounded-pill"
                      onClick={() => setUpdated(true)}
                    >
                      Editar Tarea
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-outline-secondary btn-sm px-3 rounded-pill"
                      onClick={() => cancel()}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn btn-success btn-sm px-3 rounded-pill"
                      onClick={() => updateTask(taskUpdated)}
                      disabled={loading || inputError}
                    >
                      Guardar Cambios
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
  
  );
}
