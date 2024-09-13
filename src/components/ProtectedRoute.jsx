import { Navigate } from 'react-router-dom';
import { supabase } from '~/utils/supabase';
import PropTypes from 'prop-types';

function ProtectedRoute({ children }) {
  const session = supabase.auth.session();

  if (!session) {
    // Redirige al usuario a la página de inicio de sesión si no está autenticado
    return <Navigate to="/login" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
