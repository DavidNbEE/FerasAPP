import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTh, FaUserAlt, FaRegChartBar } from 'react-icons/fa';
import './sidebar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ children }) => {
  const menuItem = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <FaTh />,
    },
    {
      path: '/activity',
      name: 'Activity',
      icon: <FaRegChartBar />,
    },
    {
      path: '/profile',
      name: 'Profile',
      icon: <FaUserAlt />,
    },
  ];

  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await axios.delete('http://localhost:8000/logout');
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="top_section">
          <h1 className="logo">FERAS</h1>
        </div>

        {menuItem.map((item, index) => (
          <NavLink key={index} to={item.path} className="link">
            <div className="icon">{item.icon}</div>
            <div className="link_text">{item.name}</div>
          </NavLink>
        ))}

        <div className="sidebar-btn">
          <button onClick={logOut}>Logout</button>
        </div>

        <div className="information-admin">
          <h6>Jika ada masalah silahkan hubungi</h6>
          <h6>email</h6>
          <p>admin@feras.app</p>
          <h6>Whatsapp</h6>
          <p>081234567890</p>
        </div>
      </div>

      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
