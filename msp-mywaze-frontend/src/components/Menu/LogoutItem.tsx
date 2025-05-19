import React from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const LogoutItem: React.FC = () => {
  const { logout, userData } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/auth');
    }
  };

  return (
    <>
        <span className="logout-greeting">
            Welcome back,<br />{userData!.email}
        </span>
        &nbsp;(
        <a onClick={handleLogout} href="#" className="logout-button">
          Logout
        </a>
        )
    </>      
  );
};

export default LogoutItem;