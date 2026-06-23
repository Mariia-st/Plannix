const express = require("express");
const cors = require("cors")
const authRoutes = require('./routes/authRoutes')
const taskRoutes= require('./routes/taskRoutes')
const userRoutes= require("./routes/userRoute")
const path = require("path")
//carga datos de .env
require('dotenv').config();
//uso de servidor
const app = express();
//port
const PORT = 3000;

//  CORS para todas las peticiones 
app.use(cors({
    origin: 'http://localhost:5173', // mi front
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

//esto hace que la carpeta sea accesible desde el navegador
app.use("/uploads", express.static(path.join(__dirname,"public","uploads")))

//Conectamos el middleware para leer jgon
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Servidor funciona')
})

//Conectamos las rutas de autorización 
//Cualquier petición que empiece con /auth Centralízala y mándala al archivo authRoutes
app.use('/auth',authRoutes)

app.use('/tasks',taskRoutes)
app.use("/user",userRoutes)


app.listen(PORT,()=>{
    console.log(`Servidor funciona en http://localhost:${PORT}`)
})