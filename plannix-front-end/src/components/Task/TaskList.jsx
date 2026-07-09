export default function TaskList({
  tasks,
  onSelectTask,
  priorityColors,
  loading,
}) {
  //orden de prioridad
  const priorityOrder = {
    urgente: 4,
    alta: 3,
    media: 2,
    baja: 1,
  };

  //carga
  if (!tasks) {
    return (
      <div className="text-center d-flex justify-content-center w-100 h-100  align-items-center">
        <div className="spinner-border" role="status" style={{width:"3rem",height:"3rem"}}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  //tasksortedo por prioridad
  const sortedTasks = tasks.sort((a, b) => {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className="bg-white bg-opacity-75 p-3 border rounded" >
      {/* Usamos 'row' para controlar el diseño según el tamaño */}
      <div className="row g-3">
        {/* Menú lateral: visible solo en pantallas medianas (md) en adelante */}
        <div className="d-none d-md-block  col-md-4 col-lg-2">
          <div
            id="list-example"
            className="list-group border"
            style={{ height: "350px", overflowY: "scroll" }}
          >
            {tasks.length === 0 ? (
              <div className=" text-center">No hay tareas</div>
            ) : (
              sortedTasks.map((task, id) => (
                <a
                  key={task.id}
                  className="list-group-item list-group-item-action small text-center p-2 bg-primary bg-opacity-75 text-white"
                  href={`#list-item-${task.id}`}
                >
                  { task.deadline ? new Date(task.deadline).toISOString().slice(0,10): "Sin fecha"}
                </a>
              ))
            )}
          </div>
        </div>

        {/* Contenido principal: ocupa todo el ancho en móviles, y el resto en escritorio */}
        <div className="col-12 col-md-8 col-lg-10">
          <div
            data-bs-spy="scroll"
            data-bs-target="#list-example"
            data-bs-offset="0"
            className="scrollspy-example bg-white border rounded p-3"
            tabIndex="0"
            style={{ height: "400px", overflowY: "scroll" }}
          >
            {tasks.length === 0 ? (
              <div className="p-5 text-center text-muted">
                No tienes tareas creadas
              </div>
            ) : (
              sortedTasks.map((task, index) => (
                <div className="border-bottom py-2" key={task.id}  onDoubleClick={() => onSelectTask(task.id)}>
                  <span
                    className="text-muted small"
                    id={`list-item-${task.id}`}
                  >
                    { task.deadline ? new Date(task.deadline).toISOString().slice(0,10): "Sin fecha"}
                  </span>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <strong
                      className="flex-grow-1 text-truncate"
                      style={{ minWidth: "100px" }}
                    >
                      {task.title}
                    </strong>
                    <span
                      className={`badge ${priorityColors[task.priority] || "bg-light"}`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-muted small">{task.status}</span>
                    <button
                      disabled={loading}
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onSelectTask(task.id)}
                    >
                      Ver
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
