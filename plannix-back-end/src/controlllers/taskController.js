//llamamos a los métodos de servicio
const taskService=require("./service/taskService")


const getTasks= async (req,res)=>{

    const userId= req.user.userId

    try{
       
        const tasks= await taskService.getTasks(userId)

        res.status(200).json(tasks)

    }catch(error){
        res.status(500).json({error:"Error al obtener tareas"})
    }

}

const createTasks= async (req,res)=>{
    const userId= req.user.userId
    const {title,description,status,priority, deadline}=req.body

    if(!title){
        res.status(400).json({error:"El titulo es obligatorio"})
    }

    try{
        const data={
                title:title,
                description:description,
                status:status,
                priority:priority,
                deadline:deadline ? new Date(deadline).toISOString() : null,
                userId: userId
            }
        const newTask= await taskService.createTasks(data)

        res.status(201).json(newTask)

    }catch(error){
        res.status(500).json({error:"No se pudo crear la tarea",details:error.message})
    }
}

const deleteTask= async (req,res)=>{
    const {id}=req.params //{} - para sacar solo el valor de objeto 
    const userId=req.user.userId

    try{
        //deleteMany puede buscar por varios filtros y delete solo por id 
        const deletedTask= await taskService.deleteTask(userId,id)

        if(deletedTask.count ===0){
            return res.status(404).json({error:"Tarea no encontrada o no tienes permiso para borrarla"})
        }

        res.json({message:"Tarea eliminada correctamente"})


    }catch(error){
        console.error("DEBUG ERROR:", error); 
        res.status(500).json({error:"Error al intentar eliminar tarea"})
    }


}

const updateTask= async (req,res)=>{
    const {id}=req.params
    const {title,description,status,priority, deadline}=req.body
    const userId=req.user.userId

    if(!title){
        res.status(400).json({error:"El titulo es obligatorio"}) 
    }

    try{
        const formattedDeadline = deadline ? new Date(deadline).toISOString() : null;
        const data={
                title,
                description,
                status,
                priority,
                deadline:formattedDeadline
            }

        const updatedTask= await taskService.updateTask(data,userId,id)

            if(updatedTask.count === 0){
                return res.status(404).json({error:"Tarea no encontrada o no tienes permiso para modificarla"})
            }
            res.json({message:"Tarea actualizada correctamente"})
    }catch(error){
        return res.status(500).json({error:"Error al actualizar tarea",details:error.message})
    }

    
}


const getTaskbyId =async(req,res)=>{

    const {id} = req.params
    const userId=req.user.userId

    try{
        const task= await taskService.getTaskbyId(userId,id)
        if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la tarea" });
    }
}

module.exports = {getTasks,createTasks,deleteTask,updateTask,getTaskbyId}
