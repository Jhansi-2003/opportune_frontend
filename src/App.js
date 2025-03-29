// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import LoginRegister from "./LoginRegister";
import JobList from "./components/jobs/JobList";
import NavBar from "./components/SNAVBAR/Sidebar";
import TNavbar from "./components/NAVBAR/NAVBAR";
import Home from "./components/home/home";
import Workshops from "./components/workshops/Workshops";
import Notifications from "./components/notifications/Notifications";
import Profile from "./components/profile/profile";
import Contactus from "./components/contactus/contactus";
import Internship from "./components/internship/internship";
import AdminDashboard from "./components/AdminDashboard";
import UserPreferences from "./UserPreferences";
import ForgotPasswordOTP from "./ForgotPasswordOTP";

import "./App.css";

function AppContent() {
  const location = useLocation();
  const hideSidebarPaths = ["/", "/register", "/forgot-password"]; // Add forgot-password here too

  const showLayout = !hideSidebarPaths.includes(location.pathname);

  return (
    <>
      {showLayout ? (
        <div className="App">
          <NavBar />
          <TNavbar />
          <div className="main-content">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/internship" element={<Internship />} />
              <Route path="/jobs" element={<JobList />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/contactus" element={<Contactus />} />
              <Route path="/logout" element={<LoginRegister />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/preferences" element={<UserPreferences />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/register" element={<LoginRegister />} />
          <Route path="/forgot-password" element={<ForgotPasswordOTP />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
