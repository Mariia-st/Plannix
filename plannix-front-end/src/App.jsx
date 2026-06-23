import { Routes, Route } from "react-router-dom";
import Login from "./components/Pages/Login";
import Layout from "./components/Pages/Layout";
import Home from "./components/Pages/Home";
import { ProtectedRoute } from "./service/ProtectedRoute";
import User from "./components/Pages/User";


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="inicio" element={ <ProtectedRoute> <Home /> </ProtectedRoute> } />
        <Route path="perfil" element={ <ProtectedRoute> <User /> </ProtectedRoute> } />
      </Routes>
    </Layout>
  );
}
