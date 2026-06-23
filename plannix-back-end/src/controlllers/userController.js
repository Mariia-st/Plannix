const path = require("path");
const prisma = require("../db")
const fs =  require("fs")//file system


const updateAvatar = async (req, res) => {

    const userId = req.user.userId
    try {


      if (!req.file) {
        return res.status(400).json({ message: "No se subió ningún archivo" });
      }

      const user= await prisma.user.findFirst({where:{id:userId}})

      if(user && user.avatar){

        //la ruta desde raiz hasta carpeta de imagen
        const oldImage= path.join(process.cwd(),"src","public",user.avatar)

        //si existe el avatar viejo lo eliminamos desde la carpeta 
       if(fs.existsSync(oldImage)){
        fs.unlinkSync(oldImage)
       }

      }


      // La ruta que voy a guardar en bbdd
      const imagePath = `/uploads/${req.file.filename}`;

      const response= await prisma.user.update({where:{id:userId},data:{avatar:imagePath}})

      
  
      res.json({ message: "Foto actualizada", path: imagePath });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



const changeDataUser= async (req,res)=>{

    const {name,email}=req.body
    const userId=req.user.userId



    try{
        // Buscamos si otro usuario ya tiene ese email
        const emailExist= await prisma.user.findFirst({
            where:{email:email,
                 NOT:{id:userId}
                }
            })

        if(emailExist){
            
            return res.status(409).json({message:"El email ya existe"})
        }

        const response= await prisma.user.update({where:{id:userId},data:{name:name,email:email}})
            

        return res.status(200).json({message:"El usuario se ha actualizado correctamente",response})
    }catch(errror){

        return res.status(500).json({message:"Error interno del servidor"})
    }
    

}


 module.exports ={changeDataUser,updateAvatar}