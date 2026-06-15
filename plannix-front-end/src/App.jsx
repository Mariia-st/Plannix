import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </Layout>
  );
}
