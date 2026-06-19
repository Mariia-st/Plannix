import { Routes, Route } from "react-router-dom";
import Login from "./components/Pages/Login";
import Layout from "./components/Pages/Layout";
import Home from "./components/Pages/Home";
import { ProtectedRoute } from "./service/ProtectedRoute";


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="home" element={ <ProtectedRoute> <Home /> </ProtectedRoute> } />
      </Routes>
    </Layout>
  );
}
