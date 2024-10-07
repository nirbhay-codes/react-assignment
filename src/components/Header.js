import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <header className='flex justify-between items-center p-4 bg-gray-800 text-white'>
      <h1 className='text-xl font-bold'>Test React App</h1>
      {user ? (
        <div className='flex items-center'>
          <p className='mr-4'>Hello, {user.email}</p>
          <button
            className='px-4 py-2 bg-red-500 rounded'
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
