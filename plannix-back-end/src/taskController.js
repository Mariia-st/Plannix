
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

module.exports = {getTasks,createTasks}
