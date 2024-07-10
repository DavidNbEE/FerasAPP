import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Register from './components/Register';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Activity from './components/Activity';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute tanpa Sidebar */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute dengan Sidebar */}
        <Route path="/" element={<WithSidebar />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="activity" element={<Activity />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Layout untuk rute dengan Sidebar
function WithSidebar() {
  return (
    <Sidebar>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="activity" element={<Activity />} />
      </Routes>
    </Sidebar>
  );
}

export default App;
