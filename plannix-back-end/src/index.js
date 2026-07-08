const express = require("express");
const cors = require("cors");
const path = require("path");
// Cargamos las variables de entorno
require('dotenv').config();

const app = express();
// Usamos el puerto que asigne Railway o el 3000 por defecto
const PORT = process.env.PORT || 3000;

// Importación de rutas y servicios
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require("./routes/userRoute");
const bot = require("./bot_telegram/bot");

// 1. Configuración de CORS
// Solo permitimos peticiones de nuestro frontend en Vercel o localhost
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.includes("localhost") || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// 2. Middlewares generales
app.use(express.json()); // Para poder leer JSON en las peticiones
// Hacemos que la carpeta de archivos subidos sea accesible públicamente
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// 3. Definición de rutas
app.get('/', (req, res) => res.send('Servidor funciona'));
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use("/user", userRoutes);

// 4. Lanzamiento del bot de Telegram
bot.launch().then(() => {
    console.log("PlannixBot está en línea!");
}).catch((err) => {
    console.error("Error al iniciar el bot:", err);
});

// 5. Arranque del servidor Express
// Escuchamos en todas las interfaces (0.0.0.0) para que Railway pueda acceder
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor funciona en http://localhost:${PORT}`);
});