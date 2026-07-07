//servidor,cors
const express = require("express");
const cors = require("cors")

//uso de servidor
const app = express();
//port
const PORT = process.env.PORT || 3000;

//ficheros de rutas
const authRoutes = require('./routes/authRoutes')
const taskRoutes= require('./routes/taskRoutes')
const userRoutes= require("./routes/userRoute")
//path para carpeta uploads
const path = require("path")

//bot
const bot= require("./bot_telegram/bot")



//carga datos de .env
require('dotenv').config();

//  CORS para todas las peticiones 
app.use(cors({
    origin: 
    ['http://localhost:5173', 
    'https://plannix-eosin.vercel.app',
    'https://plannix-hr03s67y2-mariia-str-project.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

//esto hace que la carpeta sea accesible desde el navegador
app.use("/uploads", express.static(path.join(__dirname,"public","uploads")))

//Conectamos el middleware para leer json
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Servidor funciona')
})

//Conectamos las rutas de autorización 
//Cualquier petición que empiece con /auth Centralízala y mándala al archivo authRoutes
app.use('/auth',authRoutes)

app.use('/tasks',taskRoutes)
app.use("/user",userRoutes)





//lanzamos el bot 
bot.launch().then(() => {
    console.log("PlannixBot está en línea!");
}).catch((err) => {
    console.error("Error al iniciar el bot:", err);
});

app.listen(PORT,'0.0.0.0',()=>{
    console.log(`Servidor funciona en http://localhost:${PORT}`)
})