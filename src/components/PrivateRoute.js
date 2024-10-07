import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  //   const { user } = useSelector((state) => state.auth)
  //   const { user } = useAuth();
  const storedUser = localStorage.getItem('user');
  console.log('storedUser', storedUser);
  if (storedUser) return children;

  return <Navigate to='/' />;
};

export default PrivateRoute;
