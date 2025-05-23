// components/PrivateRoute.js
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem('token'); // adjust based on your logic
  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
