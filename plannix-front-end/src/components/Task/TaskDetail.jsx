import { useState } from "react";
import { useEffect } from "react";
// components/TaskDetail.js
export default function TaskDetail({
  task,
  onClose,
  onDelete,
  priorityColors,
  loading,
  updateTask,
}) {
  const [inputError, setInputError] = useState("");
  const [updated, setUpdated] = useState(false);
  const [taskUpdated, setTaskUpdated] = useState(task);

  useEffect(() => {
    setTaskUpdated(task);
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskUpdated((prev) => ({ ...prev, [name]: value }));
    if (name === "title") {
      if (value.trim() === "") {
        setInputError("El título es obligatorio");
      } else {
        setInputError("");
      }
    }
  };

  function cancel() {
    setUpdated(false);
    setTaskUpdated(task);
  }
  return (
    <div className="fade-in mb-4 d-flex justify-content-center">
      <div className="card shadow-sm w-100" style={{ maxWidth: "700px" }}>
        <div className="d-flex">
          {!updated ? (
            <div className={`${priorityColors[taskUpdated.priority]} badge `}>
              {taskUpdated.priority}
            </div>
          ) : (
            <div
              className={`${priorityColors[taskUpdated.priority]}  text-center  p-2 `}
              style={{ width: 140 }}
            >
              <label htmlFor="priority" className="pb-2 text-white fw-bold">
                Prioridad:
              </label>

              <select
                name="priority"
                className="form-select "
                onChange={handleChange}
                value={taskUpdated.priority}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          )}

          <div className="card-body p-4 d-flex justify-content-between">
            <div style={{ flex: 1 }}>
              {!updated ? (
                <h3 className="fw-bold">{taskUpdated.title}</h3>
              ) : (
                <div className="w-50">
                  <input
                    name="title"
                    placeholder="Título"
                    className="form-control"
                    onChange={handleChange}
                    value={taskUpdated.title}
                  />
                  {inputError && (
                    <div className="text-danger small mt-1">{inputError}</div>
                  )}
                </div>
              )}
              <div className="d-flex gap-2 my-3">
                {!updated ? (
                  <span className="badge bg-light text-dark border">
                    {taskUpdated.status}
                  </span>
                ) : (
                  <div>
                    <select
                      name="status"
                      className="form-select"
                      onChange={handleChange}
                      value={taskUpdated.status}
                    >
                      <option value="pediente">Pendiente</option>
                      <option value="en curso">En curso</option>
                      <option value="completada">Completada</option>
                    </select>
                  </div>
                )}
                {!updated ? (
                  <span className="text-muted small">
                    {taskUpdated.deadline
                      ? new Date(taskUpdated.deadline).toLocaleDateString()
                      : "Sin fecha"}
                  </span>
                ) : (
                  <div>
                    <input
                      name="deadline"
                      type="date"
                      className="form-control"
                      onChange={handleChange}
                      value={
                        taskUpdated.deadline
                          ? new Date(taskUpdated.deadline)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                    />
                  </div>
                )}
              </div>
              {!updated ? (
                <p className="text-secondary bg-light p-3 rounded">
                  {taskUpdated.description}
                </p>
              ) : (
                <div>
                  <textarea
                    name="description"
                    placeholder="Descripción"
                    className="form-control"
                    rows="3"
                    onChange={handleChange}
                    value={taskUpdated.description}
                  />
                </div>
              )}
            </div>

            <button className="btn-close" onClick={onClose}></button>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white d-flex flex-column gap-2 ms-2 p-2  rounded">
          <button
            onClick={() => onDelete(task.id)}
            className="btn btn-outline-danger btn-sm"
            disabled={loading}
          >
            Eliminar
          </button>
          {!updated ? (
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setUpdated(true)}
            >
              Editar
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => cancel()}
              >
                Cancelar
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => updateTask(taskUpdated)}
                disabled={loading || inputError}
              >
                Guardar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
