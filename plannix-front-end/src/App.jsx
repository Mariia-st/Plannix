import { Routes, Route } from "react-router-dom";
import Login from "./components/Pages/Login";
import Layout from "./components/Pages/Layout";
import Home from "./components/Pages/Home";


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="home" element={<Home />} />
      </Routes>
    </Layout>
  );
}
