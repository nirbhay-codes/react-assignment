import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const storedUser = localStorage.getItem('user');
  console.log('storedUser', storedUser);
  if (storedUser) return children;

  return <Navigate to='/' />;
};

export default PrivateRoute;
