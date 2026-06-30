const prisma= require("../../db")



const taskService={

    async getTasks(userId){
        return await prisma.task.findMany({where: {userId:userId}})
    },

    async createTasks(data){
        return  await prisma.task.create({
          data
        })
    },

    async deleteTask(userId,taskId){
        return await prisma.task.deleteMany({where:{id:parseInt(taskId),userId:userId}})
    },


    async updateTask(data,userId,taskId){
       return await prisma.task.updateMany({ where:{id:parseInt(taskId),userId:userId},
        data
    })},


    async getTaskbyId(userId,taskId){
        return await prisma.task.findFirst({
            where:{
                id:parseInt(taskId),
                userId:userId
            }
        })
    }



}

module.exports= taskService