import { Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Layout from "./components/Layout";
import Home from "./components/Home";


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
