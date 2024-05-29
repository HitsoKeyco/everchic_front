// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Si no hay token, redirige a la página de inicio de sesión o a cualquier otra página
        return <Navigate to="/login" replace />;
    }

    // Si hay token, renderiza el componente solicitado
    return <Component />;
};

export default ProtectedRoute;