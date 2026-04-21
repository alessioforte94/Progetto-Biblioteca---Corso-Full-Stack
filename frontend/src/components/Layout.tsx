import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import { Navbar } from './Navbar';


export const Layout = () => {
    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Outlet />
            </Container>
        </>
    );
};
