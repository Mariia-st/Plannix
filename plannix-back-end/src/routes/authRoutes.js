const express= require('express');
const authenticateToken=require('../middlewares/authMiddleware')
//exportamos metodos 
const {register,login,me, refresh}= require('../controlllers/authController');
//express router para asignar rutas
const router= express.Router();
//rutas 
router.post('/register',register);
router.post('/login',login);
router.post('/refresh',authenticateToken,refresh);
router.get("/me", authenticateToken,me)


module.exports = router ;