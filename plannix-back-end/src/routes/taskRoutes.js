const express=require('express')
const router=express.Router()
const {getTasks,createTasks}= require('../taskController')
const authenticateToken=require('../middlewares/authMiddleware')


router.get('/',authenticateToken,getTasks)
router.post('/',authenticateToken,createTasks)


module.exports=router;