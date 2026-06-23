const multer= require("multer") // middleware bibilioteca que se usa para ficheros/fotos
const path=require("path")


//configuramos storage,  para poder controlar  donde van guardarse las fotos
const storage=multer.diskStorage({
    //destination define la ruta de carpeta 
    destination:(req,res,cb)=>{

        //cwd coge la ruta de carpeta donde se inicializa el proyecto
        //join combina fragmentos de ruta de forma segura para cualquier sistema operativo
        const uploadPath = path.join(process.cwd(), 'src', 'public', 'uploads');
        //callback se llama al null si no y ruta a la carpeta
        cb(null, uploadPath);
    },
    //define como se va llamarse el file en carpeta
    filename:(req,file,cb)=>{
    //generamos suffix unique 
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //formamos el nombre final 
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

//creamos el uploader con nuestra confisuración
const upload = multer({ storage: storage });

module.exports = upload;