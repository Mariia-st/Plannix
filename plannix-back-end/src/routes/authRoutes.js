const express= require('express');
const authenticateToken=require('../middlewares/authMiddleware')
//exportamos metodos 
const {register,login,me}= require('../authController');
//express router para asignar rutas
const router= express.Router();
//rutas 
router.post('/register',register);
router.post('/login',login);
router.get("/me", authenticateToken,me)


module.exports = router ;