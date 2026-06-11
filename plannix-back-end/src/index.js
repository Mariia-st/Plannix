const express = require("express");

const authRoutes = require('./routes/authRoutes')

require('dotenv').config();
const app = express();

const PORT = 3000;

//Conectamos el middleware para leer jgon
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Servidor funciona')
})

//Conectamos las rutas de autorización 
//Cualquier petición que empiece con /auth Centralízala y mándala al archivo authRoutes
app.use('/auth',authRoutes)

app.listen(PORT,()=>{
    console.log(`Servidor funciona en http://localhost:${PORT}`)
})