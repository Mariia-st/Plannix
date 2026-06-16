// components/TaskDetail.js
export default function TaskDetail({ task, onClose, onDelete, priorityColors }) {
    if (!task) return null;
  
    return (
      <div className="fade-in mb-4 d-flex justify-content-center">
        <div className="card shadow-sm w-100" style={{ maxWidth: "700px" }}>
          <div className="d-flex">
   
            <div style={{ width: "6px" }} className={`bg-${priorityColors[task.priority]?.split(" ")[0].replace("text-", "") || "secondary"}`}></div>
            
            <div className="card-body p-4 d-flex justify-content-between">
              <div style={{ flex: 1 }}>
                <h3 className="fw-bold">{task.title}</h3>
                <div className="d-flex gap-2 my-3">
                  <span className="badge bg-light text-dark border">{task.status}</span>
                  <span className="text-muted small">
                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : "Sin fecha"}
                  </span>
                </div>
                <p className="text-secondary bg-light p-3 rounded">{task.description}</p>
              </div>
  
                <button className="btn-close" onClick={onClose}></button>
            </div>
          </div>
        </div>
              <div>
                <div className="bg-white d-flex flex-column gap-2 ms-2 p-2  rounded">

                <button onClick={() => onDelete(task.id)} className="btn btn-outline-danger btn-sm">Eliminar </button>
                <button className="btn btn-outline-primary btn-sm">Editar </button>
                </div>
              </div>
      </div>
    );
  }