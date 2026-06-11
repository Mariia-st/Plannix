const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || "local_secret_key";

//una pequeña función que revisa si el token es válido antes de dejar pasar la petición
const authenticateToken = (req, res, next) => {
  const header = req.headers["authorization"];
  //el formato de bearer token
  const token = header.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Acceso denegado, falta el token" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalido" });
    // se pasa el id de usuario a req de siguente petición
    req.user = user;
    next();
  });
};

module.exports=authenticateToken;
