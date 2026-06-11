
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma= require('./db')
//llave secreto para firma de jwt, para asegurar que el token es real
const SECRET_KEY= process.env.SECRET_KEY || 'local_secret_key'

//register de usuario
const register = async (req, res) => {
    //recibimos datos de request
  const { name, email, password } = req.body ;
  //hash de contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    //creamos usuario 
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.status(200).json({ menssage: "Usuario creado con exito", user: user });

  } catch (error) {

    //si email se repite
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      res.status(409).json({ error: "El email ya existe" });
    }
    res.status(500).json({error:"Error interno de servidor o error de base de datos"})
  }
};

//login de usuario
const login= async (req,res)=>{
const {email,password}= req.body;
//buscamos el usuario
const user = await prisma.user.findUnique({where: {email} })
//verificamos la contraseña tambien 
if(!user || !(await bcrypt.compare(password, user.password))){
    res.status(401).json({message: "Credenciales inválidas"})
}
// jwt.sign() crea el token. Guarda el ID del usuario dentro y lo firma con la clave secreta.
const token= jwt.sign({userId:user.id},SECRET_KEY,{expiresIn:'30m'})
res.json({token})
};

//exportamos nuestros metodos
module.exports={register,login}
