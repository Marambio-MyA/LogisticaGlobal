import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const Require = ({ children, rol }) => {
  const { user } = useSelector((state) => state.auth);
  console.log(rol)
  if (user?.role !== rol) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

export const HideRequire = ({ children, rol }) => {
  const { user } = useSelector((state) => state.auth);
  if (user?.role !== rol) {
    return null;
  }

  return children;
};