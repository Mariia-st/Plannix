const express=require('express')
const router=express.Router()
const {getTasks,createTasks,deleteTask,updateTask,getTaskbyId}= require('../taskController')
const authenticateToken=require('../middlewares/authMiddleware')


router.get('/',authenticateToken,getTasks)
router.post('/',authenticateToken,createTasks)
router.delete('/:id',authenticateToken,deleteTask)
router.put('/:id',authenticateToken,updateTask)
router.get('/:id',authenticateToken,getTaskbyId)


module.exports=router;