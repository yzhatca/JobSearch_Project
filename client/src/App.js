// import main from '../assets/images/main.svg';
// import Wrapper from '../assets/wrappers/LandingPage';
// import { useAppContext } from '../context/appContext';
import React from "react";
import { Error, Landing, Register } from "./pages";
import { BrowserRouter, Routes, Link, Route } from "react-router-dom";

import "./App.css"

const App = () => {
  return (
    <BrowserRouter>
      <nav className="Main">
        <Link to="/">DashBoard</Link>
        <Link to="/register">Register</Link>
        <Link to="/landing">Landing</Link>
      </nav>

      <Routes>
        {/* 默认路径 */}
        <Route path="/" element={<div>DashBoard</div>} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        {/* 无法匹配的所有路由用*标识 */}
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
