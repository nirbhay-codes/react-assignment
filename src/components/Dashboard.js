import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // // Redirect to login if not authenticated
  // useEffect(() => {
  //   if (!user) {
  //     navigate('/');
  //   }
  // }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  if (!user) {
    return null;
  }

  return (
    <div className='p-10'>
      <h1 className='text-3xl font-bold mb-6'>Welcome to your Dashboard</h1>
      <p className='text-xl'>Hello, {user.email}</p>
      
      {/* Logout Button */}
      <button 
        className='mt-4 px-4 py-2 bg-red-500 text-white rounded'
        onClick={handleLogout}
      >
        Logout
      </button>

      {/* You can add your table and search functionalities here */}
    </div>
  );
};

export default Dashboard;
