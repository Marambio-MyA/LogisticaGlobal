import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const Require = ({ children, rol }) => {
  const { user } = useSelector((state) => state.auth);
  if (user?.role !== rol) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

export const HideRequire = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);

  if (user?.rol !== role) {
    return null;
  }

  return children;
};