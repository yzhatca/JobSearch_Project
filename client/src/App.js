// import main from '../assets/images/main.svg';
// import Wrapper from '../assets/wrappers/LandingPage';
// import { useAppContext } from '../context/appContext';
import React from "react";
import { Error, Landing, Register, ProtectedRoute } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  AllJobs,
  AddJob,
  Profile,
  Stats,
  SharedLayout,
} from "./pages/dashboard/index";

import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 默认路径 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          {/* index标签中的内容会渲染到SharedLayout组件中的Outlet占位符中，index标签可以设置这个路由为主页 */}
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />}></Route>
          <Route path="add-job" element={<AddJob />}></Route>
          <Route path="profile" element={<Profile />}></Route>
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        {/* 无法匹配的所有路由用*标识 */}
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
