const express = require("express");
const cors = require("cors")
const authRoutes = require('./routes/authRoutes')
const taskRoutes= require('./routes/taskRoutes')

require('dotenv').config();
const app = express();

const PORT = 3000;

//  CORS para todas las peticiones 
app.use(cors({
    origin: 'http://localhost:5173', // mi front
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

//Conectamos el middleware para leer jgon
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Servidor funciona')
})

//Conectamos las rutas de autorización 
//Cualquier petición que empiece con /auth Centralízala y mándala al archivo authRoutes
app.use('/auth',authRoutes)

app.use('/tasks',taskRoutes)

app.listen(PORT,()=>{
    console.log(`Servidor funciona en http://localhost:${PORT}`)
})