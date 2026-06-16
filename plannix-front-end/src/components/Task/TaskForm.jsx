// components/TaskForm.js
export default function TaskForm({ formData, setFormData, onSubmit, error }) {
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    return (
      <div className="card border-0 shadow-sm p-4 h-100" >
        <h4 className="mb-4">Crear nueva tarea</h4>
        <form className="d-flex flex-column gap-3" onSubmit={onSubmit}>
          <input 
            name="title" 
            placeholder="Título" 
            className="form-control" 
            onChange={handleChange} 
            value={formData.title} 
          />
          <div className="text-danger small ">{error}</div>
          <textarea 
            name="description" 
            placeholder="Descripción" 
            className="form-control" 
            rows="3" 
            onChange={handleChange} 
            value={formData.description}
          />
          <div className="row g-2">
            <div className="col">
              <select name="status" className="form-select" onChange={handleChange} value={formData.status}>
                <option value="pediente">Pendiente</option>
                <option value="en curso">En curso</option>
                <option value="completada">Completada</option>
              </select>
            </div>
            <div className="col">
              <select name="priority" className="form-select" onChange={handleChange} value={formData.priority}>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>
          <input 
            name="deadline" 
            type="date"
            className="form-control" 
            onChange={handleChange} 
            value={formData.deadline} 
          />
          <button type="submit" className="btn btn-primary w-100">Guardar Tarea</button>
        </form>
      </div>
    );
  }