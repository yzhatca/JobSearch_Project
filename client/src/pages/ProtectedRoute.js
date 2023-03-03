import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user) {
    console.log('ProtectedRoute');
    return <Navigate to='/landing' />;
  }
  return children;
};

export default ProtectedRoute;