import { useContext } from "react"
import { UserContext } from "./UserProvider"
import { Navigate } from "react-router-dom"




export const ProtectedRoute=({children})=>{
const{user,loading}= useContext(UserContext)

if(loading)return <div>Cargando...</div>
if(!user) return <Navigate to={"/"} />

return children 

}