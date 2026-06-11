const express= require('express');
//exportamos metodos 
const {register,login}= require('../authController');
//express router para asignar rutas
const router= express.Router();
//rutas 
router.post('/register',register);
router.post('/login',login);


module.exports = router ;