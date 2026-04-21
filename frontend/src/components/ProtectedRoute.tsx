import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// Protegge le rotte che richiedono autenticazione
export const ProtectedRoute = () => {
    const { email, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return email ? <Outlet /> : <Navigate to="/login" replace />;
};

// Protegge le rotte che richiedono il ruolo ADMIN
export const AdminRoute = () => {
    const { role, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return role === 'ADMIN' ? <Outlet /> : <Navigate to="/" replace />;
};
