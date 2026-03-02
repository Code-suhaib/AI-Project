import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Recommendations from "./pages/Recommendations";
import Dashboard from "./pages/Dashboard";
import MyActivity from "./pages/MyActivity";
import Navbar from "./components/Navbar";
import UploadResume from "./pages/UploadResume";
import ProtectedRoute from "./utils/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Dashboard = Find Internships */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/find-internships" element={<Dashboard />} />

          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/activity" element={<MyActivity />} />
           <Route path="/upload-resume" element={<UploadResume />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
