
const prisma= require('./db')


const getTasks= async (req,res)=>{

    const userId= req.user.userId

    try{
        //todos filtados por el id de este usuario
        const tasks= await prisma.task.findMany({where: {userId:userId}})
        res.json(tasks)
    }catch(error){
        res.status(500).json({error:"Error al obtener tareas"})
    }

}

const createTasks= async (req,res)=>{
    const userId= req.user.userId
    const {title,description,status,priority, deadline}=req.body

    if(!title){
        req.status(400).json({error:"El titulo es obligatorio"})
    }

    try{
        const newTask = await prisma.task.create({
            data:{
                title:title,
                description:description,
                status:status,
                priority:priority,
                deadline:deadline,
                userId: userId
            }
        })
        res.status(201).json(newTask)
    }catch(error){
        res.status(500).json({error:"No se pudo crear la tarea"})
    }
}

const deleteTask= async (req,res)=>{
    const id=req.params
    const userId=req.user.userId

    try{
        //deleteMany puede buscar por varios filtros y delete solo por id 
        const deletedTask= await prisma.task.deleteMany({where:{id:id,userId:userId}})


        if(deletedTask.count ===0){
            return res.status(404).json({error:"Tarea no encontrada o no tienes permiso para borrarla"})
        }

        res.json({message:"Tarea eliminada correctamente"})
    }catch(error){

        res.status(500).json({error:"Error al intentar eliminar tarea"})
    }


}

const updateTask= async (req,res)=>{
    const id=req.params
    const {title,description,status,priority, deadline}=req.body
    const userId=req.user.userId

    try{
        const updatedTask= await prisma.task.updateMany({ where:{id:id,userId:userId}
            ,data:{
                title,
                description,
                status,
                priority,
                deadline
            }})


            if(updatedTask.count === 0){
                return res.status(404).json({error:"Tarea no encontrada o no tienes permiso para modificarla"})
            }
            res.json({message:"Tarea actualizada correctamente"})
    }catch(error){
        return res.status(500).json({error:"Error al actualizar tarea"})
    }

    
}


const getTaskbyId =async(req,res)=>{

    const id = req.params.id
    const userId=req.user.userId

    try{
        const task= await prisma.task.findFirst({
            where:{
                id:id,
                userId:userId
            }
        })
        if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la tarea" });
    }
}

module.exports = {getTasks,createTasks}
