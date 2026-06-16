export default function TaskList({ tasks, onSelectTask, priorityColors }) {
    return (
      <div className="card border-0 shadow-sm p-4 h-100">
        <h4 className="mb-4">Mis tareas</h4>
        <ul className="list-group list-group-flush">
          { tasks && tasks.map((task) => (
            <li key={task.id} className="list-group-item d-flex align-items-center px-0 py-3">
              <strong className="flex-grow-1 text-truncate" style={{ maxWidth: "40%" }}>
                {task.title}
              </strong>
              
              <span className={`badge ${priorityColors[task.priority] || "bg-light"} mx-2`}>
                {task.priority}
              </span>
              <span className="text-muted small">{task.status}</span>
              <button 
                className="btn btn-sm btn-outline-primary" 
                onClick={() => onSelectTask(task.id)}
              >
                Ver detalle
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
